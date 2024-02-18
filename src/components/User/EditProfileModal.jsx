import BaseModal from "@UI/BaseModal";
import { UserThumbnail } from "@UI/UserThumbnail";
import { LockOutlined } from "@ant-design/icons";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useDebounce } from "@utils/hooks/useDebounce";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import SeparatingLine from "../../UI/SeparatingLine";
import { saveProfileUser } from "../../services/api";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "../../utils/constant";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { WrapEditProfile } from "./UserScreenStyled";
import { SpinnerLoading } from "@UI//SpinnerLoading";
import { compareChange, showPopupError } from "../../utils/utilities";
import { useLayoutEffect } from "react";

const InputInfoUser = (props) => {
  const { label, value, setValue } = props;
  const [localValue, setLocalValue] = useState(value);
  const debounceLocalValue = useDebounce(localValue, TIME_DELAY_FETCH_API);

  useEffect(() => {
    setValue(debounceLocalValue);
  }, [debounceLocalValue]);

  return (
    <Flex vertical className="width-100-per">
      <b>{label}</b>
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="input-about-of-user"
      />
    </Flex>
  );
};

function EditProfileModal() {
  const { login } = useAuthUser();
  const {
    state: { currentUser },
  } = useSubscription(listPostSubs, ["currentUser"]);
  const {
    styleApp: { type: typeStyle },
  } = useStyleApp();
  const { avaUrl, username, email, createdAt, showEditProfile, about } =
    currentUser || {};
  const [infoUser, setInfoUser] = useState({
    username: username,
    about: about,
    loadingUpdate: false,
  });

  const handleClosePreview = () => {
    listPostSubs.updateState({
      currentUser: { ...currentUser, showEditProfile: false },
    });
  };

  const handleCancelSave = () => {
    handleClosePreview();
    setInfoUser({ username: username, about: about });
  };

  const handleSaveProfile = async () => {
    try {
      setInfoUser({
        ...infoUser,
        loadingUpdate: true,
      });
      const resSaveProfile = await saveProfileUser(infoUser);
      login({ infoUser: { ...infoUser, ...resSaveProfile } });
      listPostSubs.updateState({
        currentUser: resSaveProfile,
        showEditProfile: false,
      });
    } catch (error) {
      showPopupError(error);
      console.error("===> Error handleSaveProfile:", error);
    } finally {
      setInfoUser({
        ...infoUser,
        loadingUpdate: false,
      });
    }
  };

  return (
    <BaseModal
      className="modal-delete-post"
      open={showEditProfile}
      onCancel={handleCancelSave}
      onOk={() => {}}
      hiddenClose={true}
      footer={<></>}
      width={400}
    >
      <WrapEditProfile isDark={typeStyle === TYPE_STYLE_APP.DARK}>
        <Flex vertical className="pt-4 pb-4 px-2" gap={12}>
          <Flex justify="space-between" gap={16} className="width-100-per">
            <Flex vertical gap={12} className="width-100-per">
              <Flex vertical>
                <b>Email</b>
                <Flex
                  align="center"
                  justify="start"
                  gap={4}
                  onClick={() => message.info("Cannot be edited!")}
                >
                  <LockOutlined />
                  <span>{email}</span>
                </Flex>
              </Flex>
              <SeparatingLine height={1} />
            </Flex>
            <UserThumbnail avaUrl={avaUrl} size={55} />
          </Flex>

          <InputInfoUser
            label="User name"
            value={infoUser.username}
            setValue={(value) => setInfoUser({ ...infoUser, username: value })}
          />
          <SeparatingLine height={1} />

          <Flex justify="space-between" gap={16}>
            <InputInfoUser
              label="Story"
              value={infoUser.about}
              setValue={(value) => setInfoUser({ ...infoUser, about: value })}
            />
          </Flex>
          <Flex
            align="center"
            justify="center"
            className={`btn-done-edit press-active ${
              infoUser.loadingUpdate ? "loading" : ""
            }`}
            onClick={handleSaveProfile}
          >
            Done
            {infoUser.loadingUpdate && (
              <SpinnerLoading className="spinner-update-info" />
            )}
          </Flex>
        </Flex>
      </WrapEditProfile>
    </BaseModal>
  );
}

export default EditProfileModal;
