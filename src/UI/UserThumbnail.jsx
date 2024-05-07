export const UserThumbnail = ({ avaUrl, size = 36, ...props }) => {
  return (
    <div
      className="avatar"
      style={{
        backgroundImage: `url(${avaUrl})`,
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        border: "0.5px solid #3b3b3b63",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      {...props}
    />
  );
};
