class MessagesController < ApplicationController
  before_action :set_group

  def index
    @groups = current_user.groups
    @messages = @group.messages.includes(:user)
    @message  = Message.new
  end

  def create
    @message = @group.messages.new(message_params)
    if @message.save
      redirect_to group_messages_path, noice: "メッセージが送信されました"
    else
      @messages = @group.messages.includes(:user)
      flash.now[:alert] = 'メッセージを入力して下さい'
      render :index
    end
  end

  private

  def message_params
    params[:message].permit(:content, :image).merge(user_id: current_user.id)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end
end
