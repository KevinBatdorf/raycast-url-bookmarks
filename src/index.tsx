import { ActionPanel, Form, SubmitFormAction, List, PushAction, getPreferenceValues, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import urlMetadata from "url-metadata";
import { getBrowserTabInfo } from "./helpers";

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
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (preferences?.preferredBrowser) {
      getBrowserTabInfo(preferences.preferredBrowser).then(({ title, url }) => {
        setTitle(title);
        setUrl(url);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (preferences?.useSiteDescription && url) {
      urlMetadata(url).then((metadata) => {
        setDescription(metadata["og:description"] ? metadata["og:description"] : metadata["description"]);
        setKeywords(metadata["keywords"] ? metadata["keywords"] : "");
      });
    }
  }, [url]);

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
      <Form.TextArea
        title="Summary"
        id="summary"
        value={summary}
        onChange={setSummary}
        placeholder="Optionally enter a searchable summary or keywords."
      />
      <Form.Separator />
      {preferences?.useTitle && title.length ? (
        <Form.TextArea title="URL Title" id="title" value={title} onChange={setTitle} />
      ) : null}
      {preferences?.useSiteDescription && description.length ? (
        <Form.TextArea title="URL Description" id="description" value={description} onChange={setDescription} />
      ) : null}
      {preferences?.useSiteDescription && keywords.length ? (
        <Form.TextArea title="URL Keywords" id="keywords" value={keywords} onChange={setKeywords} />
      ) : null}
    </Form>
  );
};

interface Preferences {
  useTitle?: boolean;
  trimQueryParams?: boolean;
  useSiteDescription?: boolean;
  preferredBrowser?: string;
}
