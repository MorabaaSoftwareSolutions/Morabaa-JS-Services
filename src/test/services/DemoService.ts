import { PopupMe } from "morabaa-provider";
import { Api, ApiService, IPagenationService, PagenationService } from "../../lib";
import MockApiService from "../../lib/mock/MockApiService";
import UpdateAny from "../components/UpdateAny";
import { Actions } from "../Demo";

const apiService = Api.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export default class DemoService extends PagenationService implements IDemoService {
  demoHeader: any = null;
  setDemoHeader = (value: any) => {};

  amTest = () => {
    this.load;
    alert("amTest");
  };

  updateHeader = async (value?: any) => {
    value.someTest = "test";
    // this.setDemoHeader(value);
    this.setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setData((prev: any) => {
      const newData = { id: 1, title: "foo" };
      return [newData, ...prev];
    });

    this.setState("idle");
  };

  popupSomthing = (target: any) => {
    PopupMe({
      Component: Actions,
      componentProps: {
        title: "test",
        service: this,
      },
      target,
    });
  };

  constructor() {
    super({
      callback: apiService.get,
      endpoint: "posts",
      onResponse: (response) => {
        console.log(response);
        return response;
      },
      useCash: true,
      storageKey: "demo",
      storage: localStorage,
    });
  }
}

export type IDemoService = DemoService;