use serde::{Deserialize, Serialize};
use std::error::Error;
use std::fs;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WatcherConfig {
    pub watchers: Vec<WatcherEntryConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WatcherEntryConfig {
    pub name: String,
    pub ports: Vec<WatcherPortConfig>,
    #[serde(rename = "logFiles")]
    pub log_files: Vec<WatcherLogFileConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WatcherPortConfig {
    pub port: u32,
    pub host: String,
    #[serde(default = "default_port_timeout")]
    pub timeout: u64,
}

fn default_port_timeout() -> u64 {
    10
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WatcherLogFileConfig {
    pub path: String,
}

pub fn load_watcher_config(path: &str) -> Result<WatcherConfig, Box<dyn Error>> {
    let file_contents = fs::read_to_string(path)?;
    let config: WatcherConfig = serde_yaml::from_str(&file_contents)?;
    Ok(config)
}
