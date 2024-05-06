use crate::net::is_port_reachable::is_port_reachable_with_timeout;
use crate::routes::types::{create_watcher_links, JsonResponseLinks};
use crate::watcher_config::WatcherConfig;
use rocket::serde::{json::Json, Serialize};
use rocket::State;
use std::collections::HashMap;
use std::time::Duration;

#[derive(Serialize)]
pub struct WatcherDetails {
    data: WatcherDetailsData,
    links: JsonResponseLinks,
}

#[derive(Serialize)]
pub struct WatcherDetailsData {
    name: String,
    ports: Vec<WatcherPortDetails>,
    links: JsonResponseLinks,
}

#[derive(Serialize)]
struct WatcherPortDetails {
    address: String,
    is_reachable: bool,
}

#[get("/watchers/<name>")]
pub fn watcher_details(
    config: &State<WatcherConfig>,
    clap_config: &State<crate::Args>,
    name: &str,
) -> Json<WatcherDetails> {
    let watcher = config.watchers.iter().find(|watch| watch.name == name);

    if watcher.is_none() {
        panic!("isso")
    }
    let watcher = watcher.unwrap();

    let mut port_details = Vec::<WatcherPortDetails>::new();
    for port in watcher.ports.iter() {
        let address = format!("{}:{}", port.host, port.port);
        let is_reachable =
            is_port_reachable_with_timeout(&address, Duration::from_millis(port.timeout));
        port_details.push(WatcherPortDetails {
            address,
            is_reachable,
        });
    }

    Json(WatcherDetails {
        data: WatcherDetailsData {
            name: watcher.name.clone(),
            ports: port_details,
            links: HashMap::new(),
        },
        links: create_watcher_links(&clap_config.base_url, &watcher.name),
    })
}
