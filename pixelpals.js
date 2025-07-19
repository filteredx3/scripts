// AutoRC.js adapté pour Loon
// Type : http-response script

module.exports = async (loon) => {
  const requestHeaders = loon.request.headers;

  const options = {
    method: 'GET',
    headers: {
      'Authorization': requestHeaders['authorization'],
      'X-Platform': 'iOS',
      'User-Agent': requestHeaders['user-agent']
    }
  };

  const productEntitlementResp = await fetch('https://api.revenuecat.com/v1/product_entitlement_mapping', options);
  const ent = await productEntitlementResp.json();

  const productEntitlementMapping = ent.product_entitlement_mapping;

  let jsonToUpdate = {
    "request_date_ms": 1704070861000,
    "request_date": "2024-01-01T01:01:01Z",
    "subscriber": {
      "entitlement": {},
      "first_seen": "2024-01-01T01:01:01Z",
      "original_application_version": "9692",
      "last_seen": "2024-01-01T01:01:01Z",
      "other_purchases": {},
      "management_url": null,
      "subscriptions": {},
      "entitlements": {},
      "original_purchase_date": "2024-01-01T01:01:01Z",
      "original_app_user_id": "70B24288-83C4-4035-B001-573285B21AE2",
      "non_subscriptions": {}
    }
  };

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

  loon.response.body = JSON.stringify(jsonToUpdate);
  return loon.response;
};
