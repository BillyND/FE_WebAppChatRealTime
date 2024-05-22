export const UserThumbnail = ({ avaUrl, size = 36, ...props }) => {
  return (
    <div
      className="avatar border-image-dashed"
      style={{
        backgroundImage: `url(${avaUrl})`,
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
      }}
      {...props}
    />
  );
};
