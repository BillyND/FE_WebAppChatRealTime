export const UserThumbnail = ({ avaUrl, size = 36 }) => {
  return (
    <div
      className="avatar"
      style={{
        backgroundImage: `url(${avaUrl})`,
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
      }}
    />
  );
};
