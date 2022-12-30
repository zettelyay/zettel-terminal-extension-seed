import {
  ExtensionScope,
  WindowWithExtensionFunction,
} from "@zettelproject/terminal-extension-api";
import { PageExtensionData } from "../../shared/types";

void ((window as WindowWithExtensionFunction).extensionFunction = function (
  api
) {
  this.while("activated", function ({ activatedApi }) {
    this.while("signedIn", function ({ signedInApi }) {
      this.while("pagePanelRendered", function ({ pagePanelRenderedApi }) {
        if (!this.scopes.includes(ExtensionScope.Page)) return;

        let pageExtensionData: PageExtensionData;

        const quickActionRegistration = this.register(
          pagePanelRenderedApi.registry.quickAction({
            title: "My extension",
            description: "My extension description",
            avatarUrl: api.extensionHeader.avatar.file
              ? api.getFileUrl(api.extensionHeader.avatar.file)
              : api.extensionHeader.avatar.dataUrl,
            disabled: true,
            switchChecked: false,
            async onClick() {
              activatedApi.access.showMessage(
                "My extension",
                "This is a message from my extension!",
                { variant: "success" }
              );
            },
            async onToggleSwitch(checked) {
              quickActionRegistration.reference.update?.({ disabled: true });
              await setPageExtensionData(
                checked ? { enabled: true } : undefined
              );
              quickActionRegistration.reference.update?.({ disabled: false });
            },
          })
        );

        const loadingIndicatorRegistration = this.register(
          pagePanelRenderedApi.registry.loadingIndicator(
            `Updating ${api.extensionHeader.name} status...`
          ),
          { initiallyInactive: true }
        );

        const tipMessageRegistration = this.register(
          pagePanelRenderedApi.registry.message<PageExtensionData>({
            state: undefined,
            render: ({ state }) => {
              if (!state) return "<p></p>";
              return `
<div>
  <p style="display: flex; align-items: center; gap: 10px;">
    <img src="${api.getFileUrl("idea.png")}" alt="tip" />
    This is a tip about my extension!
  </p>
  <p>
    This will show up when the extension is enabled on the page.
  </p>
</div>
`;
            },
            variant: "information",
          })
        );

        this.register(
          pagePanelRenderedApi.watch(
            (data) =>
              data.page.extensionManagedData[
                api.extensionHeader.id
              ] as PageExtensionData,
            (newValue, oldValue) => applyPageExtensionData(newValue)
          )
        );

        applyPageExtensionData(
          pagePanelRenderedApi.data.page.extensionManagedData[
            api.extensionHeader.id
          ] as PageExtensionData
        );

        function applyPageExtensionData(
          newPageExtensionData: PageExtensionData
        ): void {
          pageExtensionData = newPageExtensionData;
          quickActionRegistration.reference.update?.({
            disabled: false,
            switchChecked: Boolean(pageExtensionData?.enabled),
          });
          tipMessageRegistration.reference.update?.({
            hidden: !pageExtensionData,
            state: pageExtensionData,
          });
        }

        async function setPageExtensionData(
          newPageExtensionData: PageExtensionData
        ): Promise<void> {
          try {
            loadingIndicatorRegistration.activate();
            await signedInApi.access.setPageExtensionData<PageExtensionData>(
              pagePanelRenderedApi.target.pageId,
              newPageExtensionData
            );
          } catch {
            // Do nothing!
          } finally {
            loadingIndicatorRegistration.deactivate();
          }
        }
      });
    });
  });
});
