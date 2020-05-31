import { TestWindow } from "@stencil/core/testing";
import { PsEmailCapture } from "./ps-email-capture";

describe("ps-email-capture", () => {
  it("should build", () => {
    expect(new PsEmailCapture()).toBeTruthy();
  });

  describe("rendering", () => {
    let element: HTMLPsEmailCaptureElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [PsEmailCapture],
        html: "<ps-email-capture></ps-email-capture>",
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {
      cursor;
    }
  });
});
