$(document).on('turbolinks:load', function() {
  function appendUser (user) {
    const html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</a>
                </div>`
    user_list.append(html);
  }

  function appendNoUser (message) {
    const html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${message}</p>
                </div>`
    user_list.append(html);
  }

  function addUser (name, id) {
    const html = `<div class='chat-group-user clearfix js-chat-member' id='chat-group-user-${id}'>
                  <input name='group[user_ids][]' type='hidden' value='${id}'>
                  <p class='chat-group-user__name'>${name}</p>
                  <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                </div>`
    $('.js-add-user').append(html);
  }

  let userIds = []; // 検索から除くuser
  const user_list = $('#user-search-result'); // 検索結果表示欄
  $('.js-chat-member').each(function(index, el) {
    userIds.push(el.getAttribute('id'));
  });

  $('#user-search-field').on('input', function(e) {
    e.preventDefault();
    // 入力内容を取得
    const input = $('#user-search-field').val();
    if (input.length == 0) {
      user_list.empty();
      return
    };

    $.ajax({
      type: 'GET',
      url: '/users',
      dataType: 'json',
      data: { keyword: input,
              user_ids: userIds },
    })
    .done(function(users) {
      user_list.empty();
      if (users.length !== 0) {
        users.forEach(function(user) {
          appendUser(user);
        })
      } else {
        appendNoUser('一致するユーザーが見つかりません');
      }
    })
    .fail(function() {
      alert("ユーザー検索に失敗しました");
    })
  });

  user_list.on('click', '.chat-group-user__btn--add', function() {
    const userName = $(this).attr('data-user-name');
    const userId   = $(this).attr('data-user-id');

    userIds.push(userId);
    $(this).parent().remove();
    addUser(userName, userId);
  })

  $('.js-add-user').on('click', '.js-remove-btn', function() {
    const removedUserId = $(this).siblings('input').val();
    userIds = userIds.filter(id => id != removedUserId);
    $(this).parent().remove();
  })
});
