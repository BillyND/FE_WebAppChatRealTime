import { SpinnerLoading } from "@UI//SpinnerLoading";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useScrollToBottom } from "@utils/hooks/useScrollBottom";
import { Flex } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { getUser } from "../../services/api";
import { showPopupError } from "../../utils/utilities";
import ItemPreviewUser from "./ItemPreviewUser";

export default function ListAllUsers(props) {
  const { dataAllUser, setDataAllUser } = props;
  const [loadingFetch, setLoadingFetch] = useState(false);
  const { infoUser } = useAuthUser();
  const scrollContainerRef = useRef();
  const { isBottom } = useScrollToBottom(scrollContainerRef);

  useEffect(() => {
    if (isBottom) {
      handleGetUser(dataAllUser.next);
    }
  }, [isBottom]);

  useEffect(() => {
    handleGetUser(dataAllUser.next);
  }, []);

  const handleGetUser = async (next) => {
    const { page, limit } = next || {};

    if (!next) {
      return;
    }

    setLoadingFetch(true);
    try {
      const resGetUser = await getUser(page, limit);
      const { next, results } = resGetUser;

      setDataAllUser((prevData) => ({
        ...prevData,
        next,
        results: [...prevData.results, ...results].filter(
          (user) => user?._id !== infoUser?._id
        ),
      }));
    } catch (error) {
      showPopupError(error);
    } finally {
      setLoadingFetch(false);
    }
  };

  return (
    <Flex
      ref={scrollContainerRef}
      vertical
      gap={16}
      className="wrap-list-all-user enable-scroll pb-3"
    >
      {dataAllUser.results.map((user) => (
        <Fragment key={user?._id}>
          <ItemPreviewUser
            user={user}
            setDataAllUser={setDataAllUser}
            dataAllUser={dataAllUser}
          />
        </Fragment>
      ))}
      <span>
        <hr className="gray ml-5" />
      </span>
      {dataAllUser.next && (
        <SpinnerLoading style={{ opacity: loadingFetch ? "1" : "0" }} />
      )}
    </Flex>
  );
}
