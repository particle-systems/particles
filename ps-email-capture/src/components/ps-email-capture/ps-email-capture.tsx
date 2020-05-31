import { Component, Prop, State, Listen, h } from "@stencil/core";
import { emailCheck } from "../../utils/utils";

@Component({
  tag: "ps-email-capture",
  styleUrl: "ps-email-capture.css",
})
export class PsEmailCapture {
  emailBoxElem!: HTMLInputElement;
  @Prop() pid: string;
  @Prop() loc: string;
  @Prop() label: string;
  @Prop() placeholder: string;
  @Prop() btnText: string;
  @Prop() btnTextOnsubmit: string;
  @Prop() subText: string;
  @Prop() submitSuccessMsg: string;
  @Prop() submitFailedMsg: string;
  @Prop() colorValidation: string;
  @State() gecState: string = "disabled";
  @Listen("keydown")
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.keyCode === 13) {
      if (this.isTextboxFocused === true && this.gecBtnStyle === "gec-btn")
        this.handleBtnClick(ev);
    }
  }

  private isTextboxFocused: boolean = false;
  private email: string = "";
  private gecUI = {
    btn: {
      text: this.btnText,
      enabled: "gec-btn",
      disabled: "gec-btn gec-btn-disabled",
    },
    emailBox: {
      enabled: "gec-emailbox",
      valid: "gec-emailbox gec-email-valid",
      invalid: "gec-emailbox gec-email-invalid",
      disabled: "gec-emailbox gec-emailbox-disabled",
    },
  };
  private gecBtnStyle: string = this.gecUI.btn.disabled;
  private gecEmailBoxStyle: string = this.gecUI.emailBox.enabled;

  private handleEmailInput(event) {
    this.email = event.target.value;
    emailCheck(this.email)
      ? (this.gecState = "enabled")
      : (this.gecState = "disabled");
  }

  private handleTextboxFocus() {
    this.isTextboxFocused = true;
  }

  private handleTextboxBlur() {
    this.isTextboxFocused = false;
  }

  private handleBtnClick(event) {
    event.preventDefault();
    this.gecState = "submitting";
    const url = "https://gec-api.particle.systems";
    const obj = {
      gecId: this.pid,
      email: this.email,
      gecLoc: this.loc,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          this.gecState = "submitted";
        } else if (data.status === "failed") {
          this.gecState === "failed";
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        this.gecState = "failed";
      });
  }

  componentWillUpdate() {
    if (this.gecState === "disabled") {
      this.gecBtnStyle = this.gecUI.btn.disabled;
      if (this.colorValidation === "true")
        this.gecEmailBoxStyle = this.gecUI.emailBox.invalid;
      this.gecUI.btn.text = this.btnText;
    } else if (this.gecState === "enabled") {
      this.gecBtnStyle = this.gecUI.btn.enabled;
      if (this.colorValidation === "true")
        this.gecEmailBoxStyle = this.gecUI.emailBox.valid;
      this.gecUI.btn.text = this.btnText;
    } else if (this.gecState === "submitting") {
      this.gecBtnStyle = this.gecUI.btn.disabled;
      this.gecEmailBoxStyle = this.gecUI.emailBox.disabled;
      this.gecUI.btn.text = this.btnTextOnsubmit;
    } else if (this.gecState === "failed") {
      this.gecBtnStyle = this.gecUI.btn.disabled;
      this.gecUI.btn.text = this.btnText;
      this.gecEmailBoxStyle = this.gecUI.emailBox.enabled;
    }
  }

  render() {
    return (
      <div class="gec-container">
        {this.gecState === "disabled" ||
        this.gecState === "enabled" ||
        this.gecState === "submitting" ||
        this.gecState === "failed" ? (
          <div>
            <label class="gec-label" htmlFor="gec-email-box">
              {this.label}
            </label>
            <div class="gec-boxbtn-container">
              <input
                type="email"
                id="gec-email-box"
                name="gec-email-box"
                value=""
                placeholder={this.placeholder}
                class={this.gecEmailBoxStyle}
                onInput={(event: UIEvent) => this.handleEmailInput(event)}
                onFocus={() => this.handleTextboxFocus()}
                onBlur={() => this.handleTextboxBlur()}
                ref={(el) => (this.emailBoxElem = el as HTMLInputElement)}
              />
              <button
                class={this.gecBtnStyle}
                onClick={(event: UIEvent) => this.handleBtnClick(event)}
                tabIndex={
                  this.gecBtnStyle === "gec-btn gec-btn-disabled" ? -1 : 0
                }
              >
                {this.gecUI.btn.text}
              </button>
            </div>
            <small class="gec-sub-text">{this.subText}</small>
            {this.gecState === "failed" ? (
              <div class="gec-failed-container">
                <span class="gec-failed-msg">{this.submitFailedMsg}</span>
              </div>
            ) : (
              ``
            )}
          </div>
        ) : (
          <div class="gec-success-container">
            <span class="gec-success-msg">{this.submitSuccessMsg}</span>
          </div>
        )}
      </div>
    );
  }
}
