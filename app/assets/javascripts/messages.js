$(document).on('turbolinks:load', function() {
  function buildHTML(message) {
    const image = message.image ? `<img src="${message.image}">` : "" ;
    const html = `<div class="message" data-message_id="${message.id}">
                    <div class="message__upper-info">
                      <p class="message__upper-info__talker">${message.user_name}</p>
                      <p class="message__upper-info__date">${message.created_at}</p>
                    </div>
                    <p class="message__text">${message.content}</p>
                    ${image}
                  </div>`
    return html;
  }

  let timerId
  const path = window.location.pathname;
  const groupId  = $('.main-header__left-box__current-group').data('group_id');

  document.addEventListener("turbolinks:visit", function(){
    clearInterval(timerId);
  });

  // メッセージ送信
  $('#new_message').on('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    $.ajax({
      url: path,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message) {
      if (message.content == "" && message.image == null) {
        alert('メッセージを入力して下さい');
      } else {
        $('#new_message')[0].reset();
        $('.messages').append(buildHTML(message));
        $('.messages').animate({
          scrollTop: $('.messages')[0].scrollHeight
        }, 200);

      }
    })
    .fail(function() {
      alert("通信に失敗しました");
    })
    .always(function() {
      $(".submit-btn").prop('disabled', false)
    });
  });

  // 自動更新
  if (path == `/groups/${groupId}/messages`) {
    timerId = setInterval(function() {
      const latestId = $('.message:last').data('message_id');
      $.ajax({
        url: path,
        data: {
          latest_id: latestId
        },
        dataType: 'json'
      })
      .done(function(newMessages) {
        if (newMessages.length != 0) {
          $.each(newMessages, function(i, message) {
            $('.messages').append(buildHTML(message));
          });
          $('.messages').animate({
            scrollTop: $('.messages')[0].scrollHeight
          }, 200);
        }
      })
      .fail(function() {
        alert('自動更新に失敗しました')
      });
    }, 5000);
  }
});
