import BaseModal from "@UI/BaseModal";
import { UserThumbnail } from "@UI/UserThumbnail";
import { LeftOutlined } from "@ant-design/icons";
import { IconSettingsCircle, IconTick } from "@assets/icons/icon";
import { updateStyleConversation } from "@services/api";
import { OPTIONS_STYLE_CONVERSATION } from "@utils/constant";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { openModalWithOutRender, useModal } from "@utils/hooks/useModal";
import { useSearchParams } from "@utils/hooks/useSearchParams";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { rgbaToHex } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { useEffect, useState } from "react";
import { conversationSubs } from "../../utils/globalStates/initGlobalState";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import { WrapBoxStyleConversation } from "./StyledMessageScreen";

function ModalSelectStyleConversation() {
  const { state: modalState, closeModal } = useModal([
    "SELECT_STYLE_CONVERSATION",
  ]);

  const {
    state: { conversationColor },
  } = useSubscription(conversationSubs, ["conversationColor"]);

  const [conversationId] = useSearchParams(["conversationId"]);
  const [selectedColor, setSelectedColor] = useState(conversationColor);

  useEffect(() => {
    setSelectedColor(conversationColor);
  }, [conversationColor]);

  const handleApplyStyle = () => {
    if (conversationColor !== selectedColor) {
      conversationSubs.updateState({
        conversationColor: selectedColor,
      });
    }

    updateStyleConversation(conversationId, selectedColor);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    closeModal("SELECT_STYLE_CONVERSATION");
    setSelectedColor(conversationColor);
  };

  return (
    <BaseModal
      width={400}
      className="modal-delete-post"
      open={modalState["SELECT_STYLE_CONVERSATION"]}
      onCancel={handleCloseModal}
      onOk={handleApplyStyle}
      title="Pick a color for conversation"
    >
      <WrapBoxStyleConversation className="mt-3">
        {OPTIONS_STYLE_CONVERSATION.map((style) => {
          return (
            <div
              key={style}
              className="item-style-conversation  press-active"
              style={{ background: style }}
              onClick={() => setSelectedColor(style)}
            >
              {rgbaToHex(selectedColor) === rgbaToHex(style) && <IconTick />}
            </div>
          );
        })}
      </WrapBoxStyleConversation>
    </BaseModal>
  );
}

function ConversationHeader({ username, avaUrl, email, receiverIdChat }) {
  const navigate = useNavigateCustom();
  const { isMobile } = useWindowSize();
  const { infoUser } = useAuthUser();
  const { _id: userId } = infoUser;

  // Subscribe to conversation updates
  const { state } = useSubscription(conversationSubs, [
    "listConversations",
    "usersOnline",
  ]);

  const { listConversations, usersOnline } = state || {};
  const isOnline = usersOnline?.[receiverIdChat];

  // Calculate unread conversations
  const conversationsUnread = listConversations.filter(
    (conversation) => !conversation?.usersRead?.includes(userId)
  )?.length;

  // Function to navigate to user profile
  const goToProfileUser = () => {
    navigate(`/user?email=${email}`);
  };

  // Function to navigate back to conversation list
  const backToScreenListConversation = () => {
    navigate(`/message`);
  };

  return (
    <Flex vertical>
      <Flex
        className="header-conversation pt-3 pb-2 px-3"
        align="center"
        justify="space-between"
      >
        <Flex gap={10} align="center" justify="start">
          {isMobile && (
            <div>
              <Flex
                onClick={backToScreenListConversation}
                align="center"
                justify="center"
                className="icon-back-conversation press-active"
              >
                <div
                  className={`icon-un-read ${
                    conversationsUnread ? "show" : ""
                  }`}
                >
                  {conversationsUnread}
                </div>
                <LeftOutlined />
              </Flex>
            </div>
          )}

          <div
            className="ava-user-conversation cursor-pointer"
            onClick={goToProfileUser}
          >
            <UserThumbnail avaUrl={avaUrl} size={35} />
            {isOnline && <span className="icon-online"></span>}
          </div>

          {/* Render username as a clickable link */}
          <Flex vertical>
            <b className="cursor-pointer" onClick={goToProfileUser}>
              {username}
            </b>
            {isOnline && <span className="user-active-state">Active now</span>}
          </Flex>
        </Flex>

        <IconSettingsCircle
          onClick={() => openModalWithOutRender("SELECT_STYLE_CONVERSATION")}
          className="press-active"
        />
      </Flex>
      <hr className="width-100-per gray" />

      <ModalSelectStyleConversation />
    </Flex>
  );
}

export default ConversationHeader;
