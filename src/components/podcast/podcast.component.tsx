import { FunctionComponent, useState } from "react";
import { Observer, observer } from "mobx-react";

import { useForm } from "../../strict-forms/context";
import StrictForm from "../../strict-forms/components";

import InputField from "../../atoms/input-field";
import PodcastStore from "./store/podcast-store";

const PodcastView: FunctionComponent = () => {
  const podcastStore = useForm<PodcastStore>();

  const [newLang, setNewLang] = useState("");

  return (
    <div>
      <InputField
        store={podcastStore}
        fieldName="name"
        onChange={(e) => {
          podcastStore.setFieldValue("name", e.target.value);
        }}
        onBlur={() => {
          podcastStore.setFieldTouched("name", true);
        }}
      />
      Is name touched: {`${podcastStore.touched.name}`}
      <InputField
        store={podcastStore}
        fieldName="author"
        onChange={(e) => {
          podcastStore.setFieldValue("author", e.target.value);
        }}
        onBlur={() => {
          podcastStore.setFieldTouched("author", true);
        }}
      />
      Is author touched: {`${podcastStore.touched.author}`}
      <InputField
        store={podcastStore}
        fieldName="desc"
        onChange={(e) => {
          podcastStore.setFieldValue("desc", e.target.value);
        }}
      />
      <br />
      <br />
      <input
        value={newLang}
        onChange={(e) => {
          setNewLang(e.target.value);
        }}
      />
      <button
        onClick={() => {
          podcastStore.addLang(newLang);
        }}
      >
        Add New Lang
      </button>
      <br />
      <Observer>
        {() => (
          <InputField
            store={podcastStore}
            value={podcastStore.langTexts[0].name}
            onChange={(e) => {
              podcastStore.setLangValue("English", "name", e.target.value);
            }}
          />
        )}
      </Observer>
      <Observer>
        {() => (
          <InputField
            store={podcastStore}
            value={podcastStore.langTexts[0].desc}
            onChange={(e) => {
              podcastStore.setLangValue("English", "desc", e.target.value);
            }}
          />
        )}
      </Observer>
      <br />
      <button
        onClick={() => {
          podcastStore.setFieldValue("name", "Mutated!");
        }}
      >
        Mutate State
      </button>
      <input type="submit" name="submit" id="submit" value="Submit" />
    </div>
  );
};

const PodcastLangView: FunctionComponent = observer(() => {
  const podcastStore = useForm<PodcastStore>();

  return <pre>{JSON.stringify(podcastStore.langTexts, null, 2)}</pre>;
});

const PodcastErrorView: FunctionComponent = observer(() => {
  const podcastStore = useForm<PodcastStore>();

  return (
    <pre>
      {JSON.stringify(
        podcastStore.errors.map(({ constraints, property }) => ({
          constraints,
          property,
        })),
        null,
        2
      )}
    </pre>
  );
});

const LangTextsErrorView: FunctionComponent = observer(() => {
  const podcastStore = useForm<PodcastStore>();
  const englishIndex = podcastStore.langTexts.findIndex(
    (l) => l.language === "English"
  );
  const langTextErrors = podcastStore.errors.find(
    (e) => e.property === "langTexts"
  );

  return (
    <pre>
      {langTextErrors &&
        langTextErrors.children &&
        JSON.stringify(
          langTextErrors.children[englishIndex].children!.map(
            ({ constraints, property }) => ({
              constraints,
              property,
            })
          ),
          null,
          2
        )}
    </pre>
  );
});

const Podcast: FunctionComponent = () => {
  return (
    <section>
      <StrictForm
        store={new PodcastStore()}
        handleSubmit={(store) => {
          console.log(store);
        }}
      >
        <PodcastView />
        <PodcastErrorView />
        <LangTextsErrorView />
        <PodcastLangView />
      </StrictForm>
    </section>
  );
};

export default Podcast;
