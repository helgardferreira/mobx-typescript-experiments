import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { observable, makeObservable, action } from "mobx";

import { FormStore } from "../../../strict-forms/store/form-store";
import LangTexts from "./lang-texts";

export default class PodcastStore extends FormStore {
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

  @observable
  @ValidateNested()
  langTexts: LangTexts[] = [];

  @action
  addLang(language: string) {
    this.langTexts.push(new LangTexts(language));
  }

  @action
  setLangValue(language: string, field: keyof LangTexts, value: any) {
    const langText = this.langTexts.find((lang) => lang.language === language);
    if (!langText) return;

    langText[field] = value;
    this.validate();
  }

  constructor() {
    super();
    makeObservable(this);
    this.addLang("English");
  }
}
