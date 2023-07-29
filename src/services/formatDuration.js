export default function formatDuration(duration) {
  const units = new Date(duration * 1000)
    .toLocaleDateString(navigator.language, {
      minute: "2-digit",
      second: "2-digit",
    })
    .substring(12, 20);

  return units;
}
