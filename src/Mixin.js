export const mixins = {
    methods: {
        __(key) {
            return key;
        }
    },
    areYouShure() {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: this.__("Are you sure?"),
                text: this.__("Do you definitely want to complete this procedure?"),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: this.__("Cancel"),
                confirmButtonText: this.__("Yes"),
            }).then(async (action) => {
                if (action.isConfirmed) {
                    resolve({ isConfirmed: true });
                } else {
                    Swal.fire({
                        text: this.__("The procedure has been cancelled."),
                        icon: "success",
                        confirmButtonText: this.__("Ok"),
                    });
                    resolve({ isConfirmed: false });
                }
            });

        });
    },
}