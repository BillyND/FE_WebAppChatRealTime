import React from "react";
import "./Contact.scss";
import { MessageOutlined } from "@ant-design/icons";
import { Flex } from "antd";

function Contact(props) {
  return (
    <div className="contact-container pb-4">
      <span className="title-contact">Contact</span>
      <div className="content-contact">
        {[1, 2, 3, 3, 3, 3, 3, 3].map((user) => {
          return (
            <div className="item-contact" key={user}>
              <div
                className="avatar-user item"
                style={{
                  backgroundImage: `url('data:image/jpeg;base64,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`,
                }}
              ></div>
              <span className="name-user item">{user?.name}nameee</span>
              <MessageOutlined className="item icon-message" />
            </div>
          );
        })}
      </div>

      <Flex justify="center">
        <span className="button-view-all-inbox">View all</span>
      </Flex>
    </div>
  );
}

export default Contact;
