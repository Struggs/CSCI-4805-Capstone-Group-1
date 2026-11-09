import { supabase } from './supabaseClient.js';
export function initializeMarketplace() {
    //Marketplace elements
    const searchInput = document.querySelector(".marketplace-search input");
    const categoryFilter = document.getElementById("category");
    const conditionFilter = document.getElementById("condition");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    const priceButton = document.getElementById("price-filter-button");
    const priceDropdown = document.querySelector(".price-dropdown");
    const clearButton = document.getElementById("clear-filters");
    const sellButton = document.getElementById("create-listing");
    const listingsGrid = document.getElementById("listings-grid");
    const noListings = document.getElementById("no-listings");
    const viewMoreButton = document.getElementById("view-more-listings");

    const STORAGE_KEY = "campushub_marketplaceListings";
    const PAGE_SIZE = 6;
    let visibleCount = PAGE_SIZE;
    // Store the logged-in user's ID
let currentUserId = null;

// Check who is logged in
supabase.auth.getUser().then(({ data, error }) => {
    if (error) {
        console.error("Could not get current user:", error);
        return;
    }

    currentUserId = data.user?.id || null;
    displayListings();
});

    const exampleListings = [
        {
            id: 1,
            title: "Calculus Textbook",
            price: 45,
            category: "textbooks",
            condition: "like-new",
            seller: "John Smith",
            description: "Calculus textbook in great condition.",
            createdAt: Date.now() - 2 * 60 * 60 * 1000
        },
        {
            id: 2,
            title: "Mini Fridge",
            price: 80,
            category: "dorm-essentials",
            condition: "used",
            seller: "Jane Doe",
            description: "Compact mini fridge, perfect for dorm rooms.",
            createdAt: Date.now() - 24 * 60 * 60 * 1000
        },
        {
            id: 3,
            title: "Concert Tickets",
            price: 120,
            category: "tickets",
            condition: "new",
            seller: "Michael Brown",
            description: "Concert tickets available for sale",
            createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000
        }
    ];

    async function loadListings() {
        const { data, error } = await supabase
            .from('marketplace_listings')
            .select('*')
            .eq('status', 'Available')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Could not load marketplace listings:', error);
            return [];
        }

        return (data || []).map(function (listing) {
            return {
                ...listing,
                createdAt: new Date(listing.created_at).getTime(),
                seller: listing.seller || "CampusHub Student"
            };
        });
    }

    let listings = [];

async function uploadMarketplaceImage(file, userId) {
    if (!file) return null;

    const extension = file.name.split(".").pop().toLowerCase();
    const filePath = `${userId}/marketplace/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from("post_Images")
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false
        });

    if (error) {
        console.error("Marketplace image upload failed:", error);
        throw error;
    }

    return filePath;
}
// Update a listing that belongs to the logged-in user
async function updateListing(listing, changes) {
    if (!currentUserId || listing.seller_id !== currentUserId) {
        alert("You can only edit your own listings.");
        return null;
    }

    const { data, error } = await supabase
        .from("marketplace_listings")
        .update(changes)
        .eq("id", listing.id)
        .eq("seller_id", currentUserId)
        .select()
        .single();

    if (error || !data) {
        console.error("Could not update listing:", error);
        alert("Your listing could not be updated.");
        return null;
    }

    // Update the listing on the page
    listings = listings.map(item =>
        item.id === listing.id
            ? { ...item, ...data }
            : item
    );

    displayListings();
    return data;
}
// Delete a listing that belongs to the logged-in user
async function deleteListing(listing) {
    if (!currentUserId || listing.seller_id !== currentUserId) {
        alert("You can only delete your own listings.");
        return false;
    }

    // Remove the listing from Supabase
    const { data, error } = await supabase
        .from("marketplace_listings")
        .delete()
        .eq("id", listing.id)
        .eq("seller_id", currentUserId)
        .select("id");

    if (error || !data || data.length === 0) {
        console.error("Could not delete listing:", error);
        alert("Your listing could not be deleted.");
        return false;
    }
// Delete the listing's image from Storage
if (listing.image_path) {
    const { error: imageError } = await supabase.storage
        .from("post_Images")
        .remove([listing.image_path]);

    if (imageError) {
        console.error("Could not delete listing image:", imageError);
    }
}

// Remove the deleted listing from the page
listings = listings.filter(item => item.id !== listing.id);
displayListings();

return true;
    
}  
async function saveListings(newListing) {
    const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
            seller_id: newListing.seller_id,
            title: newListing.title,
            price: newListing.price,
            category: newListing.category,
            condition: newListing.condition,
            description: newListing.description,
            image_path: newListing.image_path || null,
            status: 'Available'
        })
        .select()
        .single();

    if (error) {
        console.error("Could not save marketplace listing:", error);
        return null;
    }

    return data;
}

    function formatPrice(price) {
        return "$" + Number(price).toFixed(2);
    }

    function formatCondition(condition) {
        const names = {
            "new": "New",
            "like-new": "Used Like New",
            "used": "Used"
        };
        return names[condition] || condition;
    }

    function formatCategory(category) {
        const names = {
            "textbooks": "Textbooks",
            "electronics": "Electronics",
            "dorm-essentials": "Dorm Essentials",
            "clothing": "Clothing",
            "tickets": "Tickets",
            "other": "Other"
        };
        return names[category] || category;
    }

    function timeAgo(timestamp) {
        const seconds = Math.max(
            0,
            Math.floor((Date.now() - timestamp) / 1000)
        );
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `Posted ${minutes} minute(s) ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Posted ${hours} hour(s) ago`;
        const days = Math.floor(hours / 24);
        return `Posted ${days} day(s) ago`;
    }


    function makeElement(tag, className, content) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }
        if (content !== undefined) {
            element.textContent = content;
        }
        return element;
    }

    //Filter listings based on user's inputs
    function getFilteredListings() {
        const search = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        const condition = conditionFilter.value;
        const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;


        //Check which listings match the filters 
        return listings.filter(function (listing) {
            const matchesSearch =
                listing.title.toLowerCase().includes(search) ||
                listing.description.toLowerCase().includes(search);

            const matchesCategory =
                category === "" || listing.category === category;
            const matchesCondition =
                condition === "" || listing.condition === condition;
            const matchesMin =
                minPrice === "" || listing.price >= Number(minPrice);
            const matchesMax =
                maxPrice === "" || listing.price <= Number(maxPrice);
            return matchesSearch &&
                matchesCategory &&
                matchesCondition &&
                matchesMin &&
                matchesMax;
        });
    }

    function displayListings() {
        const filteredListings = getFilteredListings();
        const visibleListings = filteredListings.slice(0, visibleCount);
        listingsGrid.innerHTML = "";
        visibleListings.forEach(function (listing) {
            const card = document.createElement("div");
            card.className = "listing-card";

            const image = makeElement("div", "listing-image");

if (listing.image_path) {
    const { data } = supabase.storage
        .from("post_Images")
        .getPublicUrl(listing.image_path);

    const img = document.createElement("img");
    img.src = data.publicUrl;
    img.alt = listing.title;
    img.loading = "lazy";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    image.appendChild(img);
} else {
    image.textContent = "No Image";
}
            const info = makeElement("div", "listing-info");
            const title = makeElement("h3", "", listing.title);
            const price = makeElement(
                "p",
                "listing-price",
                formatPrice(listing.price)
            );
            const condition = makeElement(
                "p",
                "listing-condition",
                formatCondition(listing.condition)
            );
            const seller = makeElement("div", "listing-seller");
            const sellerName = makeElement("span", "", listing.seller);
            seller.appendChild(sellerName);
            const posted = makeElement(
                "p",
                "listing-time",
                timeAgo(listing.createdAt)
            );
            info.appendChild(title);
            info.appendChild(price);
            info.appendChild(condition);
            info.appendChild(seller);
            info.appendChild(posted);
            card.appendChild(image);
            card.appendChild(info);
            card.addEventListener("click", function () {
                showListingDetails(listing);
            });
            listingsGrid.appendChild(card);
        });

        noListings.style.display =
            filteredListings.length === 0 ? "block" : "none";

        viewMoreButton.style.display =
            filteredListings.length > visibleCount ? "block" : "none";
    }


    function createPopup() {
        const overlay = document.createElement("div");

        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "1000";

        const popup = document.createElement("div");

        popup.style.backgroundColor = "white";
        popup.style.padding = "25px";
        popup.style.borderRadius = "10px";
        popup.style.width = "90%";
        popup.style.maxWidth = "450px";
        popup.style.maxHeight = "85vh";
        popup.style.overflowY = "auto";
        popup.style.color = "#111827";

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                overlay.remove();
            }
        });

        return { overlay, popup };
    }


    function showListingDetails(listing) {
        const { overlay, popup } = createPopup();

        const title = makeElement("h2", "", listing.title);
        const price = makeElement(
            "p",
            "listing-price",
            formatPrice(listing.price)
        );
        const category = makeElement(
            "p",
            "",
            "Category: " + formatCategory(listing.category)
        );
        const condition = makeElement(
            "p",
            "",
            "Condition: " + formatCondition(listing.condition)
        );
        const seller = makeElement(
            "p",
            "",
            "Seller: " + listing.seller
        );
        const description = makeElement(
            "p",
            "",
            listing.description
        );

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.type = "button";

        closeButton.addEventListener("click", function () {
            overlay.remove();
        });
        if (listing.image_path) {
    const { data } = supabase.storage
        .from("post_Images")
        .getPublicUrl(listing.image_path);

    const image = document.createElement("img");
    image.src = data.publicUrl;
    image.alt = listing.title;
    image.style.width = "100%";
    image.style.maxHeight = "300px";
    image.style.objectFit = "contain";
    image.style.borderRadius = "8px";
    image.style.marginBottom = "15px";

    popup.appendChild(image);
}
        popup.appendChild(title);
        popup.appendChild(price);
        popup.appendChild(category);
        popup.appendChild(condition);
        popup.appendChild(seller);
        popup.appendChild(description);

// Only show Delete if this listing belongs to the user
if (currentUserId && listing.seller_id === currentUserId) {
    // Show the edit button to the owner
const editButton = document.createElement("button");
editButton.textContent = "Edit Listing";
editButton.style.marginRight = "10px";

editButton.addEventListener("click", function () {
    overlay.remove();
    showEditForm(listing);
});

popup.appendChild(editButton);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Listing";
    deleteButton.type = "button";

    // Make the delete button red
    deleteButton.style.backgroundColor = "#dc2626";
    deleteButton.style.color = "white";
    deleteButton.style.marginRight = "10px";
    deleteButton.style.marginTop = "15px";

    // Ask before deleting the listing
    deleteButton.addEventListener("click", async function () {
        const confirmed = confirm(
            "Are you sure you want to delete this listing?"
        );

        if (!confirmed) return;

        deleteButton.disabled = true;
        deleteButton.textContent = "Deleting...";

        // Delete the listing from Supabase
        const deleted = await deleteListing(listing);

        if (deleted) {
            overlay.remove();
        } else {
            deleteButton.disabled = false;
            deleteButton.textContent = "Delete Listing";
        }
    });

    popup.appendChild(deleteButton);
}

popup.appendChild(closeButton);
    }


    function createFormInput(labelText, type, required = true) {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "12px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.display = "block";
        label.style.marginBottom = "5px";

        const input = document.createElement("input");
        input.type = type;
        input.required = required;
        input.style.width = "100%";
        input.style.padding = "9px";
        input.style.boxSizing = "border-box";

        wrapper.appendChild(label);
        wrapper.appendChild(input);

        return { wrapper, input };
    }

    // Make a dropdown for the selling form
    function createFormSelect(labelText, options) {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "12px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.display = "block";
        label.style.marginBottom = "5px";

        const select = document.createElement("select");
        select.required = true;
        select.style.width = "100%";
        select.style.padding = "9px";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select an option";
        select.appendChild(placeholder);

        options.forEach(function (option) {
            const item = document.createElement("option");
            item.value = option.value;
            item.textContent = option.label;
            select.appendChild(item);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);

        return { wrapper, select };
    }

    // Show the form to edit a listing
function showEditForm(listing) {
    const { overlay, popup } = createPopup();
    const form = document.createElement("form");

    popup.appendChild(makeElement("h2", "", "Edit Listing"));

    // Add the current listing information
    const title = createFormInput("Item Name", "text");
    const price = createFormInput("Price ($)", "number");
    const category = createFormSelect("Category", [
        { value: "Textbooks", label: "Textbooks" },
        { value: "Electronics", label: "Electronics" },
        { value: "Dorm Essentials", label: "Dorm Essentials" },
        { value: "Clothing", label: "Clothing" },
        { value: "Tickets", label: "Tickets" },
        { value: "Other", label: "Other" }
    ]);
    const condition = createFormSelect("Condition", [
        { value: "New", label: "New" },
        { value: "Used Like New", label: "Used Like New" },
        { value: "Used", label: "Used" }
    ]);
    const description = document.createElement("textarea");

    title.input.value = listing.title;
    price.input.value = listing.price;
    price.input.min = "0";
    price.input.step = "0.01";
    category.select.value = listing.category;
    condition.select.value = listing.condition;
    description.value = listing.description;
    description.required = true;
    description.rows = 4;
    description.style.width = "100%";

    // Add fields to the form
    [title.wrapper, price.wrapper, category.wrapper,
        condition.wrapper, description].forEach(field => {
        field.style.marginBottom = "12px";
        form.appendChild(field);
    });

    const save = makeElement("button", "", "Save Changes");
    save.type = "submit";
    form.appendChild(save);
    popup.appendChild(form);

    // Save the edited listing
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const amount = Number(price.input.value);

        if (!Number.isFinite(amount) || amount < 0) {
            alert("Enter a valid price.");
            return;
        }

        save.disabled = true;

        const updated = await updateListing(listing, {
            title: title.input.value.trim(),
            price: amount,
            category: category.select.value,
            condition: condition.select.value,
            description: description.value.trim()
        });

        if (updated) overlay.remove();
        else save.disabled = false;
    });
}
    function showSellForm() {
        const { overlay, popup } = createPopup();

        const heading = makeElement("h2", "", "Sell an Item");
        heading.style.marginBottom = "15px";

        const form = document.createElement("form");

        const titleField = createFormInput("Item Name", "text");
        const priceField = createFormInput("Price ($)", "number");
        const sellerField = createFormInput("Your Name", "text");
        const imageField = createFormInput("Item Image", "file", false);
imageField.input.accept = "image/*";

const imagePreview = document.createElement("img");
imagePreview.style.display = "none";
imagePreview.style.width = "100%";
imagePreview.style.maxHeight = "200px";
imagePreview.style.objectFit = "contain";
imagePreview.style.marginTop = "10px";
imagePreview.style.borderRadius = "8px";

imageField.input.addEventListener("change", function () {
    const file = imageField.input.files[0];

    if (!file) {
        imagePreview.style.display = "none";
        imagePreview.removeAttribute("src");
        return;
    }

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        alert("Please choose an image smaller than 5 MB.");
        imageField.input.value = "";
        imagePreview.style.display = "none";
        return;
    }

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";
    imagePreview.onload = function () {
        URL.revokeObjectURL(imagePreview.src);
    };
});

imageField.wrapper.appendChild(imagePreview);

        priceField.input.min = "0";
        priceField.input.step = "0.01";

        const categoryField = createFormSelect("Category", [
    { value: "Textbooks", label: "Textbooks" },
    { value: "Electronics", label: "Electronics" },
    { value: "Dorm Essentials", label: "Dorm Essentials" },
    { value: "Clothing", label: "Clothing" },
    { value: "Tickets", label: "Tickets" },
    { value: "Other", label: "Other" }
]);

        const conditionField = createFormSelect("Condition", [
    { value: "New", label: "New" },
    { value: "Used Like New", label: "Used Like New" },
    { value: "Used", label: "Used" }
]);

        const descriptionWrapper = document.createElement("div");
        descriptionWrapper.style.marginBottom = "12px";

        const descriptionLabel = makeElement(
            "label",
            "",
            "Description"
        );
        descriptionLabel.style.display = "block";

        const descriptionInput = document.createElement("textarea");
        descriptionInput.required = true;
        descriptionInput.rows = 4;
        descriptionInput.style.width = "100%";
        descriptionInput.style.padding = "9px";
        descriptionInput.style.boxSizing = "border-box";

        descriptionWrapper.appendChild(descriptionLabel);
        descriptionWrapper.appendChild(descriptionInput);

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Post Listing";

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = "Cancel";
        cancelButton.style.marginLeft = "10px";

        cancelButton.addEventListener("click", function () {
            overlay.remove();
        });

        form.appendChild(titleField.wrapper);
        form.appendChild(priceField.wrapper);
        form.appendChild(categoryField.wrapper);
        form.appendChild(conditionField.wrapper);
        form.appendChild(sellerField.wrapper);
        form.appendChild(imageField.wrapper);
        form.appendChild(descriptionWrapper);
        form.appendChild(submitButton);
        form.appendChild(cancelButton);

        popup.appendChild(heading);
        popup.appendChild(form);

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const title = titleField.input.value.trim();
            const price = Number(priceField.input.value);
            const category = categoryField.select.value;
            const condition = conditionField.select.value;
            const seller = sellerField.input.value.trim();
            const description = descriptionInput.value.trim();

            if (!title || !seller || !description ||
                !category || !condition ||
                priceField.input.value === "" ||
                !Number.isFinite(price) || price < 0) {
                alert("Please fill out all fields correctly.");
                return;
            }


            const newListing = {
                title: title,
                price: price,
                category: category,
                condition: condition,
                description: description
            };


            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                alert("Please sign in to sell an item.");
                return;
            }

            newListing.seller_id = user.id;
            const selectedImage = imageField.input.files[0];

if (selectedImage) {
    submitButton.disabled = true;
    submitButton.textContent = "Uploading image...";

    try {
        newListing.image_path = await uploadMarketplaceImage(
            selectedImage,
            user.id
        );
    } catch (error) {
        alert("Image upload failed. Please try again.");
        submitButton.disabled = false;
        submitButton.textContent = "Post Listing";
        return;
    }
}

            const savedListing = await saveListings(newListing);

            if (!savedListing) {
    if (newListing.image_path) {
        const { error: cleanupError } = await supabase.storage
            .from("post_Images")
            .remove([newListing.image_path]);

        if (cleanupError) {
            console.error("Could not clean up uploaded image:", cleanupError);
        }
    }

    submitButton.disabled = false;
    submitButton.textContent = "Post Listing";

    alert("Your listing could not be saved.");
    return;
}

listings.unshift({
    ...savedListing,
    createdAt: new Date(savedListing.created_at).getTime(),
    seller: seller
});

            visibleCount = PAGE_SIZE;

            searchInput.value = "";
            categoryFilter.value = "";
            conditionFilter.value = "";
            minPriceInput.value = "";
            maxPriceInput.value = "";

            overlay.remove();
            displayListings();
        });
    }


    function refreshListings() {
        visibleCount = PAGE_SIZE;
        displayListings();
    }

    // Search and filter events
    searchInput.addEventListener("input", refreshListings);
    categoryFilter.addEventListener("change", refreshListings);
    conditionFilter.addEventListener("change", refreshListings);
    minPriceInput.addEventListener("input", refreshListings);
    maxPriceInput.addEventListener("input", refreshListings);

    // Show or hide the price inputs
    priceButton.addEventListener("click", function () {
        const isVisible = priceDropdown.style.display === "flex";

        priceDropdown.style.display = isVisible ? "none" : "flex";
    });

    // Clear all filters
    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        categoryFilter.value = "";
        conditionFilter.value = "";
        minPriceInput.value = "";
        maxPriceInput.value = "";

        priceDropdown.style.display = "none";

        refreshListings();
    });

    sellButton.addEventListener("click", function () {
        showSellForm();
    });

    viewMoreButton.addEventListener("click", function () {
        visibleCount += PAGE_SIZE;
        displayListings();
    });
    priceDropdown.style.display = "none";

    loadListings().then(function (data) {
        listings = data;
        displayListings();
    });
}


