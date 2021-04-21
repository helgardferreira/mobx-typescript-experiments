import { ValidationError, validate } from "class-validator";
import { observable, action, makeObservable } from "mobx";
import { FormFieldKeys, FormFieldObject } from "../../types";

/* function drillErrors(errors: ValidationError[]) {
  errors.forEach((error) => {
    console.log(error);
    if (error.children && error.children.length > 0) {
      drillErrors(error.children);
    }
  });
} */

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
          // drillErrors(res);
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
