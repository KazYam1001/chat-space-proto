$(document).on('turbolinks:load', function() {
  function buildHTML(message) {
    let image = ""
    if (message.image.url) {
      image = `<img src="${message.image.url}">`;
    }
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
    .done(function(data) {
      $('#new_message')[0].reset();
      $('.messages').append(buildHTML(data));
      $('.messages').animate({
        scrollTop: $('.messages')[0].scrollHeight
      }, 200);
    })
    .fail(function() {
      alert("通信に失敗しました");
    });

    setTimeout(function() {
      $(".submit-btn").prop('disabled', false)
    }, 1000);
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
      .done(function(data) {
        if (data.length != 0) {
          $.each(data, function(i, message) {
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
