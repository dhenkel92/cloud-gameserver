use std::net::{TcpStream, ToSocketAddrs};
use std::time::Duration;

/// Attempts a TCP connection to an address and returns whether it succeeded
/// Copied with pride from https://github.com/ufoscout/port-check-rs/blob/master/src/lib.rs#L10
pub fn is_port_reachable_with_timeout<A: ToSocketAddrs>(address: A, timeout: Duration) -> bool {
    match address.to_socket_addrs() {
        Ok(addrs) => {
            for address in addrs {
                if TcpStream::connect_timeout(&address, timeout).is_ok() {
                    return true;
                }
            }
            false
        }
        Err(_err) => false,
    }
}
