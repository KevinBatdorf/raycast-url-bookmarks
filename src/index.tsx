import { ActionPanel, Form, SubmitFormAction, List, PushAction, getPreferenceValues, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { runAppleScript } from "run-applescript";

export default function Command() {
  const preferences: Preferences = getPreferenceValues();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <List isLoading={loading}>
      {loading || (
        <List.Item
          key="add-url"
          icon={{ source: Icon.Plus, tintColor: "#ff3e78" }}
          title="Add URL"
          actions={
            <ActionPanel>
              <PushAction title="Add URL" target={<AddUrl preferences={preferences} />} />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}

const AddUrl = ({ preferences }: { preferences: Preferences }) => {
  const [url, setUrl] = useState<string>();
  const [keywords, setKeywords] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    //TODO: Load in data file from support area
    //TODO: find fuzzy search library
    //TODO: process active URL
    //TODO: Check if active URl can break
    //TODO: Remove hash and params optionally
    //TODO: Add press action to open url in browser
    //TODO: delete and edit URLs?
    //TODO: Get URL snippet??? https://github.com/laurengarcia/url-metadata#readme

    console.log({ preferences });
    switch (preferences?.preferredBrowser) {
      case "chrome":
        runAppleScript('tell application "Google Chrome" to URL of active tab of front window as text').then((url) => {
          console.log({ url });
          setUrl(url);
          setLoading(false);
        });
        break;
      default:
        setLoading(false);
    }
  }, []);
  return (
    <Form
      isLoading={loading}
      navigationTitle="Add URL to collection"
      actions={
        <ActionPanel>
          <SubmitFormAction title="Submit Description" onSubmit={(values) => console.log(values)} />
        </ActionPanel>
      }
    >
      <Form.TextField title="URL" id="url" value={url} onChange={setUrl} />
      <Form.Separator />
      <Form.TextArea
        title="Keywords"
        id="name"
        value={keywords}
        onChange={setKeywords}
        placeholder="Enter keywords or a description you want to be searchable."
      />
    </Form>
  );
};

interface Preferences {
  trimQueryParams?: string;
  preferredBrowser?: string;
}
