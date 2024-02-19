export const UserThumbnail = ({ avaUrl, size = 36 }) => {
  return (
    <div
      className="avatar"
      style={{
        backgroundImage: `url(${avaUrl})`,
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        border: "0.5px solid #313131",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
};
