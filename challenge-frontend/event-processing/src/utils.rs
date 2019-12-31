use regex::{Regex, Captures};

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Function for parsing some non strict JSON lines into strict JSON format.
pub fn line_transformation(line: &str) -> String {
    lazy_static! {
        static ref RE1: Regex = Regex::new(r"([\$\w]+)\s*:").unwrap();
        static ref RE2: Regex = Regex::new(r"'([^']+)'").unwrap();
    }
    let line_transformed = String::from(RE1.replace_all(&line.clone(), add_quotes_to_key).as_ref());
    String::from(RE2.replace_all(line_transformed.as_str(), change_single_quotes_too_double).as_ref())
}

/// Function for adding double quotes into key values for usage in line_transformation.
pub fn add_quotes_to_key(caps: &Captures) -> String {
    format!("\"{}\":", &caps[1])
}

/// Function for changing any single quote usage in the JSON line into double quote for usage in the line_transformation.
pub fn change_single_quotes_too_double(caps: &Captures) -> String {
    format!("\"{}\"", &caps[1])
}