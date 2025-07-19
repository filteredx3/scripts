// Loon Response Script - Modify RevenueCat API response
// This should be set as a response script for the URL pattern

let body = $response.body;
let obj;

try {
    obj = JSON.parse(body);
} catch (e) {
    console.log("Failed to parse response body");
    $done({});
}

// Create the mock subscriber data
let jsonToUpdate = {
    "request_date_ms": Date.now(),
    "request_date": new Date().toISOString(),
    "subscriber": {
        "entitlement": {},
        "first_seen": "2024-01-01T01:01:01Z",
        "original_application_version": "9692",
        "last_seen": new Date().toISOString(),
        "other_purchases": {},
        "management_url": null,
        "subscriptions": {},
        "entitlements": {},
        "original_purchase_date": "2024-01-01T01:01:01Z",
        "original_app_user_id": "70B24288-83C4-4035-B001-573285B21AE2",
        "non_subscriptions": {}
    }
};

// If the original response has product_entitlement_mapping, use it
if (obj.product_entitlement_mapping) {
    const productEntitlementMapping = obj.product_entitlement_mapping;
    
    for (const [entitlementId, productInfo] of Object.entries(productEntitlementMapping)) {
        const productIdentifier = productInfo.product_identifier;
        const entitlements = productInfo.entitlements;
        
        for (const entitlement of entitlements) {
            jsonToUpdate.subscriber.entitlements[entitlement] = {
                "purchase_date": "2024-01-01T01:01:01Z",
                "original_purchase_date": "2024-01-01T01:01:01Z",
                "expires_date": "9692-01-01T01:01:01Z",
                "is_sandbox": false,
                "ownership_type": "PURCHASED",
                "store": "app_store",
                "product_identifier": productIdentifier
            };
            
            // Add product identifier to subscriptions
            jsonToUpdate.subscriber.subscriptions[productIdentifier] = {
                "expires_date": "9692-01-01T01:01:01Z",
                "original_purchase_date": "2024-01-01T01:01:01Z",
                "purchase_date": "2024-01-01T01:01:01Z",
                "is_sandbox": false,
                "ownership_type": "PURCHASED",
                "store": "app_store"
            };
        }
    }
} else {
    // Fallback: create generic premium entitlements
    console.log("No product mapping found, creating generic premium access");
    
    // Add common premium entitlements (adjust these based on your app)
    const commonEntitlements = ["premium", "pro", "plus", "unlimited"];
    const productId = "com.app.premium.yearly";
    
    for (const entitlement of commonEntitlements) {
        jsonToUpdate.subscriber.entitlements[entitlement] = {
            "purchase_date": "2024-01-01T01:01:01Z",
            "original_purchase_date": "2024-01-01T01:01:01Z",
            "expires_date": "9692-01-01T01:01:01Z",
            "is_sandbox": false,
            "ownership_type": "PURCHASED",
            "store": "app_store",
            "product_identifier": productId
        };
    }
    
    jsonToUpdate.subscriber.subscriptions[productId] = {
        "expires_date": "9692-01-01T01:01:01Z",
        "original_purchase_date": "2024-01-01T01:01:01Z",
        "purchase_date": "2024-01-01T01:01:01Z",
        "is_sandbox": false,
        "ownership_type": "PURCHASED",
        "store": "app_store"
    };
}

// Return the modified response
$done({ body: JSON.stringify(jsonToUpdate) });
