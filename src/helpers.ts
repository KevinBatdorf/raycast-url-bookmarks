import { runAppleScript } from "run-applescript";

export const getBrowserTabInfo = async (browser: string) => {
  const defaultValue = {
    title: "",
    url: "",
  };
  try {
    return await Promise.all([
      await runAppleScript(`tell application "${browser}" to return URL of active tab of front window as text`),
      await runAppleScript(`tell application "${browser}" to return name of active tab of front window as text`),
    ]).then(([url, title]) => ({ url, title }));
  } catch (error) {
    console.error(error);
    return defaultValue;
  }
};
