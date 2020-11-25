const Intersection = {

    options: {
        root: null,
        threshold: 0.1
    },

    releases: (release) => {
        const observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if(!entry.isIntersecting) {
                    return;
                  }
                    release.classList.add("is-active-release");
                    observer.unobserve(entry.target);
                });
        }, Intersection.options);

        observer.observe(release);
    },

}
 
export { Intersection };