use std::collections::HashMap;

pub type JsonResponseLinks = HashMap<String, String>;

pub fn create_watcher_links(base_url: &str, watcher_name: &str) -> JsonResponseLinks {
    let mut map = HashMap::new();

    map.insert(
        "self".to_string(),
        format!("{}/watchers/{}/", base_url, watcher_name),
    );
    map.insert(
        "log-files".to_string(),
        format!("{}/watchers/{}/logs/", base_url, watcher_name),
    );

    map
}
