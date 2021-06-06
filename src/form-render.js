export default {
  name: "HFormRender",
  inject: ["HFormer"],
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  render(h) {
    const { options, HFormer } = this;
    const { render } = options;
    return render(h, { model: HFormer.model });
  }
};
