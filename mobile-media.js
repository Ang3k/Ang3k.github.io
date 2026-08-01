(() => {
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const controlSelector = "[data-mobile-media-control]";
  const linkHandlers = new Map();

  let dialog;
  let dialogImage;
  let dialogTitle;
  let dialogStatus;
  let dialogHint;
  let closeButton;
  let activeControl;

  const getDimensions = (image) => ({
    width: Number(image.getAttribute("width")) || image.naturalWidth,
    height: Number(image.getAttribute("height")) || image.naturalHeight,
  });

  const getTitle = (figure, image) => {
    const caption = figure.querySelector("figcaption")?.textContent.trim();
    return caption || image.alt.trim();
  };

  const resetDialog = () => {
    document.documentElement.classList.remove("mobile-media-open");

    if (dialogImage) {
      dialogImage.removeAttribute("src");
      dialogImage.removeAttribute("style");
      dialogImage.dataset.pannable = "false";
    }

    if (activeControl?.isConnected) {
      activeControl.focus({ preventScroll: true });
    }

    activeControl = undefined;
  };

  const ensureDialog = () => {
    if (dialog) {
      return;
    }

    dialog = document.createElement("dialog");
    dialog.className = "mobile-media-dialog";
    dialog.setAttribute("aria-labelledby", "mobile-media-dialog-title");

    const shell = document.createElement("div");
    shell.className = "mobile-media-dialog__shell";

    const toolbar = document.createElement("div");
    toolbar.className = "mobile-media-dialog__toolbar";

    dialogTitle = document.createElement("p");
    dialogTitle.className = "mobile-media-dialog__title";
    dialogTitle.id = "mobile-media-dialog-title";

    closeButton = document.createElement("button");
    closeButton.className = "mobile-media-dialog__close";
    closeButton.type = "button";
    closeButton.textContent = "Fechar";
    closeButton.setAttribute("aria-label", "Fechar imagem ampliada");
    closeButton.addEventListener("click", () => dialog.close());

    const viewport = document.createElement("div");
    viewport.className = "mobile-media-dialog__viewport";

    dialogStatus = document.createElement("p");
    dialogStatus.className = "mobile-media-dialog__status";
    dialogStatus.setAttribute("role", "status");

    dialogImage = document.createElement("img");
    dialogImage.className = "mobile-media-dialog__image";
    dialogImage.decoding = "async";
    dialogImage.addEventListener("load", () => {
      dialogStatus.hidden = true;
      viewport.removeAttribute("aria-busy");
    });
    dialogImage.addEventListener("error", () => {
      dialogStatus.hidden = false;
      dialogStatus.textContent = "Não foi possível carregar esta imagem.";
      viewport.removeAttribute("aria-busy");
    });

    dialogHint = document.createElement("p");
    dialogHint.className = "mobile-media-dialog__hint";

    toolbar.append(dialogTitle, closeButton);
    viewport.append(dialogStatus, dialogImage);
    shell.append(toolbar, viewport, dialogHint);
    dialog.append(shell);
    document.body.append(dialog);

    dialog.addEventListener("close", resetDialog);
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && dialog.open) {
        event.preventDefault();
        dialog.close();
      }
    });
  };

  const openImage = (figure, image, control) => {
    ensureDialog();

    const { width, height } = getDimensions(image);
    const ratio = width && height ? width / height : 1;
    const availableWidth = Math.max(window.innerWidth - 32, 240);
    let targetWidth = Math.min(width || availableWidth, availableWidth);

    if (ratio >= 2.2) {
      targetWidth = Math.min(width || 1120, 1120);
    } else if (ratio >= 1.4) {
      targetWidth = Math.min(width || 880, 880);
    }

    const pannable = targetWidth > availableWidth + 1;
    const source = new URL(image.getAttribute("src"), document.baseURI).href;

    activeControl = control;
    dialogTitle.textContent = getTitle(figure, image);
    dialogImage.alt = image.alt.trim();
    dialogImage.dataset.pannable = String(pannable);
    dialogImage.style.width = `${targetWidth}px`;
    dialogStatus.hidden = false;
    dialogStatus.textContent = "Carregando imagem…";
    dialogHint.textContent = pannable
      ? "Arraste para os lados e para cima ou para baixo para explorar os detalhes."
      : "Use o gesto de pinça caso queira ampliar ainda mais.";

    const viewport = dialog.querySelector(".mobile-media-dialog__viewport");
    viewport.setAttribute("aria-busy", "true");
    dialogImage.src = source;
    document.documentElement.classList.add("mobile-media-open");
    dialog.showModal();
    viewport.scrollTo({ top: 0, left: 0 });
    closeButton.focus({ preventScroll: true });
  };

  const addControls = () => {
    document.querySelectorAll("main figure").forEach((figure) => {
      if (figure.querySelector(controlSelector)) {
        return;
      }

      const image = figure.querySelector('img[alt]:not([alt=""])');
      if (!image) {
        return;
      }

      const linkedMedia = image.closest("a");
      if (linkedMedia) {
        if (!linkHandlers.has(linkedMedia)) {
          const originalHasPopup = linkedMedia.getAttribute("aria-haspopup");
          const handler = (event) => {
            if (
              !mobileQuery.matches ||
              event.button > 0 ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey
            ) {
              return;
            }

            event.preventDefault();
            openImage(figure, image, linkedMedia);
          };

          linkedMedia.addEventListener("click", handler);
          linkedMedia.setAttribute("aria-haspopup", "dialog");
          linkedMedia.dataset.mobileMediaLink = "true";
          linkHandlers.set(linkedMedia, { handler, originalHasPopup });
        }

        return;
      }

      const { width, height } = getDimensions(image);
      if (width < 480 && height < 360) {
        return;
      }

      const control = document.createElement("button");
      control.className = "mobile-media-trigger";
      control.type = "button";
      control.textContent = "Ampliar";
      control.dataset.mobileMediaControl = "true";
      control.setAttribute("aria-label", `Ampliar imagem: ${image.alt.trim()}`);
      control.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openImage(figure, image, control);
      });

      const media = image.closest("picture") || image;
      figure.dataset.mobileMediaEnhanced = "true";
      media.insertAdjacentElement("afterend", control);
    });
  };

  const removeControls = () => {
    activeControl = undefined;

    if (dialog?.open) {
      dialog.close();
    }

    document.querySelectorAll(controlSelector).forEach((control) => control.remove());
    document.querySelectorAll('[data-mobile-media-enhanced="true"]').forEach((figure) => {
      delete figure.dataset.mobileMediaEnhanced;
    });

    linkHandlers.forEach(({ handler, originalHasPopup }, link) => {
      link.removeEventListener("click", handler);
      delete link.dataset.mobileMediaLink;

      if (originalHasPopup === null) {
        link.removeAttribute("aria-haspopup");
      } else {
        link.setAttribute("aria-haspopup", originalHasPopup);
      }
    });
    linkHandlers.clear();

    dialog?.remove();
    dialog = undefined;
    dialogImage = undefined;
    dialogTitle = undefined;
    dialogStatus = undefined;
    dialogHint = undefined;
    closeButton = undefined;
    document.documentElement.classList.remove("mobile-media-open");
  };

  const syncWithViewport = () => {
    if (mobileQuery.matches) {
      addControls();
      return;
    }

    removeControls();
  };

  mobileQuery.addEventListener("change", syncWithViewport);
  syncWithViewport();
})();
