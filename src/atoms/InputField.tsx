import { PropsWithChildren } from "react";
import { Observer } from "mobx-react";
import { FormFieldKeys } from "../types";
import { FormStore } from "../components/Podcast";

interface IProps<T extends FormStore> {
  store: T;
  fieldName: FormFieldKeys<T>;
  id?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function InputField<T extends FormStore>(props: PropsWithChildren<IProps<T>>) {
  const { fieldName, id, store, onChange, onBlur } = props;

  return (
    <Observer>
      {() => (
        <input
          type="text"
          name={fieldName as string}
          id={id ? id : (fieldName as string)}
          value={store[fieldName]}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
        />
      )}
    </Observer>
  );
}

export default InputField;
