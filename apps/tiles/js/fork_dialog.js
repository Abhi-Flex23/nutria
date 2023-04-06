// Helper class to manage the Fork dialog

class ForkDialog {
  constructor() {
    this.dialog = document.getElementById("fork-chooser");
    this.dialog.addEventListener("sl-after-hide", this);
    document
      .getElementById("fork-chooser-fork")
      .addEventListener("click", this);
    document
      .getElementById("fork-chooser-cancel")
      .addEventListener("click", this);
    this.promise = null;
  }

  handleEvent(event) {
    if (this.promiseDone) {
      return;
    }

    if (event.type === "sl-after-hide") {
      // sl-after-hide is also dispatched when "closing" the sl-select drop down,
      // but we should not do anything in that case.
      if (event.target !== this) {
        return;
      }

      this.promiseDone = true;
      this.promise?.reject();
      return;
    }

    let id = event.target.getAttribute("id");
    if (id === "fork-chooser-fork") {
      let input = this.dialog.querySelector("#fork-url").value.trim();
      let result = input || this.dialog.querySelector("#fork-list").value;
      if (!result.endsWith("/manifest.webmanifest")) {
        result += "/manifest.webmanifest";
      }
      this.promiseDone = true;
      this.promise?.resolve(result);
    } else if (id === "fork-chooser-cancel") {
      this.promiseDone = true;
      this.promise?.reject();
    } else {
      console.error(
        `Unexpected event: ${event.type} from ${event.target.localName}#${id}`
      );
      return;
    }
    this.dialog.hide();
  }

  open() {
    this.promiseDone = false;
    return new Promise(async (resolve, reject) => {
      this.promise = { resolve, reject };
      await graph.waitForDeps("apps manager");

      let apps = await appsManager.getAll();
      let list = this.dialog.querySelector("#fork-list");
      list.innerHTML = "";
      for (let app of apps) {
        let summary = await appsManager.getSummary(app);
        const isTile = summary.url?.startsWith("tile://");
        if (isTile) {
          let option = document.createElement("sl-option");
          option.value = summary.updateUrl;
          let icon = document.createElement("img");
          icon.src = summary.icon;
          icon.setAttribute("slot", "prefix");
          let desc = document.createElement("span");
          desc.textContent = summary.description;
          option.append(icon);
          option.append(desc);

          list.append(option);
        }
      }
      this.dialog.show();
    });
  }
}
