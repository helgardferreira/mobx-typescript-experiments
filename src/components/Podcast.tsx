import {
  Component,
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from "react";
import { action, makeObservable, observable } from "mobx";
import { Observer } from "mobx-react";
import {
  IsNotEmpty,
  IsString,
  validate,
  ValidationError,
} from "class-validator";
import InputField from "../atoms/InputField";
import { FormFieldKeys, FormFieldObject } from "../types";

export class FormStore {
  @observable
  errors: ValidationError[] = [];

  @observable
  touched: Partial<Record<FormFieldKeys<this>, boolean>> = {};

  @action
  async validate() {
    return validate(this)
      .then(
        action("validateSuccess", (res) => {
          this.errors = res;
        })
      )
      .catch(
        action("validateError", (err) => {
          console.error(err);
        })
      );
  }

  constructor() {
    makeObservable(this);
  }

  @action
  setFieldValue<U extends FormFieldKeys<this>>(
    field: U,
    value: FormFieldObject<this>[U]
  ) {
    this[field] = value;
    this.touched[field] = true;
    this.validate();
  }

  @action
  setFieldTouched<U extends FormFieldKeys<this>>(field: U, value: boolean) {
    this.touched[field] = value;
    this.validate();
  }
}

class PodcastStore extends FormStore {
  @observable
  @IsNotEmpty()
  @IsString()
  name: string = "";

  @observable
  @IsNotEmpty()
  @IsString()
  author: string = "";

  @observable
  @IsNotEmpty()
  @IsString()
  desc: string = "";

  constructor() {
    super();
    makeObservable(this);
  }
}

interface FormProps<T extends FormStore> {
  store: T;
  handleSubmit: (fields: FormFieldObject<T>) => void;
}

// interface FormState<T extends FormStore> {}

interface IFormContext<T extends FormStore> {
  fields: T;
}

const FormContext = createContext<IFormContext<any>>({
  fields: new FormStore(),
});

function useForm<T extends FormStore>() {
  return useContext<IFormContext<T>>(FormContext).fields;
}

function FormProvider<T extends FormStore>(
  props: PropsWithChildren<{ value: T }>
) {
  const { value, children } = props;
  const formFields = value;

  return (
    <FormContext.Provider
      value={{
        fields: formFields,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

class StrictForm<T extends FormStore> extends Component<
  FormProps<T>
  // FormState<T>
> {
  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { store } = this.props;
    await store.validate();

    if (store.errors.length === 0) {
      this.props.handleSubmit(store);
    }
  }

  // componentDidUpdate(prevProps: FormProps<T>) {}

  render() {
    return (
      <FormProvider value={this.props.store}>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          {this.props.children}
        </form>
      </FormProvider>
    );
  }
}

const PodcastView: FunctionComponent = () => {
  const podcastStore = useForm<PodcastStore>();

  return (
    <>
      <InputField
        store={podcastStore}
        fieldName="name"
        onChange={(e) => {
          podcastStore.setFieldValue("name", e.target.value);
        }}
      />
      <InputField
        store={podcastStore}
        fieldName="author"
        onChange={(e) => {
          podcastStore.setFieldValue("author", e.target.value);
        }}
      />
      <InputField
        store={podcastStore}
        fieldName="desc"
        onChange={(e) => {
          podcastStore.setFieldValue("desc", e.target.value);
        }}
      />
      <button
        onClick={() => {
          podcastStore.setFieldValue("name", "Mutated!");
        }}
      >
        Mutate State
      </button>
      <input type="submit" name="submit" id="submit" value="Submit" />
    </>
  );
};

const PodcastErrorView: FunctionComponent = () => {
  const podcastStore = useForm<PodcastStore>();

  return (
    <Observer>
      {() => (
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
      )}
    </Observer>
  );
};

const Podcast: FunctionComponent = () => {
  return (
    <>
      <section>
        <StrictForm
          store={new PodcastStore()}
          handleSubmit={(store) => {
            console.log(store);
          }}
        >
          <PodcastView />
          <PodcastErrorView />
        </StrictForm>
      </section>
    </>
  );
};

export default Podcast;
