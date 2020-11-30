const Intersection = {

    // Intersection observer params
    options: {
        root: null,
        threshold: 0.1
    },

    // release intersection observer
    releases: (release) => {
        const observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if(!entry.isIntersecting) {
                    return;
                  }
                  // add active class & unobserve
                    release.classList.add("is-active-release");
                    observer.unobserve(entry.target);
                });
        }, Intersection.options);

        observer.observe(release);
    },

}
 
export { Intersection };