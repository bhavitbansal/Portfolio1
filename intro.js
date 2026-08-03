gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById("intro-video");
const fade = document.getElementById("fade-overlay");
const introUI = document.getElementById("intro-ui");

let redirected = false;
let uiHidden = false;
let duration = 0;

video.muted = true;
video.playsInline = true;
video.preload = "auto";

video.addEventListener("loadedmetadata", () => {

    duration = video.duration;

    video.currentTime = 0;

    // Scroll hint animation
    gsap.to("#intro-ui", {
        y: 8,
        opacity: 0.45,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    ScrollTrigger.create({

        trigger: "#scroll-container",

        start: "top top",

        end: "bottom bottom",

        pin: true,

        scrub: true,

        anticipatePin: 1,

        invalidateOnRefresh: true,

        onUpdate(self) {

            const targetTime = self.progress * duration;

            if (Math.abs(video.currentTime - targetTime) > 0.01) {
                video.currentTime = targetTime;
            }

            // Hide scroll hint once scrolling starts
            if (self.progress > 0.01 && !uiHidden) {

                uiHidden = true;

                gsap.to(introUI, {
                    opacity: 0,
                    y: 20,
                    duration: 0.4,
                    ease: "power2.out"
                });

            }

            // Redirect at the end
            if (self.progress >= 0.999 && !redirected) {

                redirected = true;

                gsap.to(fade, {

                    opacity: 1,

                    duration: 0.4,

                    ease: "power2.out",

                    onComplete() {

                        window.location.href = "home.html";

                    }

                });

            }

        }

    });

    ScrollTrigger.refresh();

});