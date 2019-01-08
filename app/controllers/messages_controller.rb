class MessagesController < ApplicationController
  before_action :set_group

  def index
    @messages = @group.messages.includes(:user)
    @message  = Message.new
    respond_to do |format|
      format.html
      format.json {
        # latest_idより大きいidのメッセージを取得
        @new_messages = Message.where(["id > ? and group_id = ?", params[:latest_id], @group.id])
      }
    end
  end

  def create
    @message = @group.messages.new(message_params)
    if @message.save
      respond_to do |format|
        format.html { redirect_to group_messages_path, notice: "メッセージが送信されました" }
        format.json
      end
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
