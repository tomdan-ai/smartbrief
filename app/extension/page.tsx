import ExtensionPopup from "@/components/extension-popup"

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">SmartBrief Browser Extension</h1>
          <p className="text-lg text-gray-600">
            Experience the extension interface that makes content summarization effortless
          </p>
        </div>

        <div className="flex justify-center">
          <ExtensionPopup />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">This is a preview of the SmartBrief browser extension interface</p>
        </div>
      </div>
    </div>
  )
}
