import { on } from "./dom-utils.js";

export function addSocialButtonListeners() {
  on("click", '[data-share="tweet"]', ev => {
    var tweet = ev.currentTarget.dataset.shareText;
    var url = ev.currentTarget.dataset.shareUrl;
    url = url ? url : window.location.href;

    var twitterURL =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(tweet) +
      "&url=" +
      encodeURIComponent(url) +
      "&tw_p=tweetbutton";
    window.open(twitterURL, "_blank");
  });

  on("click", '[data-share="facebook"]', ev => {
    var url = ev.currentTarget.dataset.shareUrl;
    url = url ? url : window.location.href;
    var facebookURL =
      "https://www.facebook.com/dialog/feed?app_id=2352768061509311&display=page&link=" +
      encodeURIComponent(url);
    window.open(facebookURL, "_blank");
  });
}