interface Props {
  channel: string;
}

export function TwitchEmbed({ channel }: Props) {
  const parent =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  const src = `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true`;
  return (
    <div className="mb-6 max-w-[640px] mx-auto panel rounded-md overflow-hidden">
      <div className="aspect-video">
        <iframe
          src={src}
          title={`${channel} on Twitch`}
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
