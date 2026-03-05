// Browser stub for `sharp` to satisfy Turbopack resolution.
// ColorThief should never call this path in the browser; it's only used for Node decoding.
export default function sharpBrowserStub() {
  throw new Error("sharp is not available in the browser build.");
}

