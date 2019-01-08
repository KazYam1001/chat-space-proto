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

  const path = window.location.pathname;
  const group_id  = $('.group-info__group-name').attr('group_id');

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
      // メッセージが増えていくdivのscrollHeightを使ってスクロール
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
});
