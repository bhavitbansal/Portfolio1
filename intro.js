gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById("intro-video");
const fade = document.getElementById("fade-overlay");

let redirected = false;
let duration = 0;

video.muted = true;
video.playsInline = true;
video.preload = "auto";

// Wait until metadata is available
video.addEventListener("loadedmetadata", () => {

    duration = video.duration;

    // Show first frame
    video.currentTime = 0;

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