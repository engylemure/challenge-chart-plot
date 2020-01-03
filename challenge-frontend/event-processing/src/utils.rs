use regex::{Captures, Regex};

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
pub fn fix_non_strict_json(line: &str) -> String {
    lazy_static! {
        static ref RE1: Regex = Regex::new(r"([\$\w]+)\s*:").unwrap();
        static ref RE2: Regex = Regex::new(r"'([^']+)'").unwrap();
    }
    let line_transformed = RE1.replace_all(line, add_quotes_to_key);
    RE2.replace_all(line_transformed.as_ref(), change_single_quotes_too_double)
        .to_string()
}

/// Function for adding double quotes into key values for usage in line_transformation.
pub fn add_quotes_to_key(caps: &Captures) -> String {
    format!("\"{}\":", &caps[1])
}

/// Function for changing any single quote usage in the JSON line into double quote for usage in the line_transformation.
pub fn change_single_quotes_too_double(caps: &Captures) -> String {
    format!("\"{}\"", &caps[1])
}

/// Given a vector containing a partial Cartesian product, and a list of items,
/// return a vector adding the list of items to the partial Cartesian product.
///
/// # Example
///
/// ```
/// let partial_product = vec![vec![1, 4], vec![1, 5], vec![2, 4], vec![2, 5]];
/// let items = &[6, 7];
/// let next_product = partial_cartesian(partial_product, items);
/// assert_eq!(next_product, vec![vec![1, 4, 6],
///                               vec![1, 4, 7],
///                               vec![1, 5, 6],
///                               vec![1, 5, 7],
///                               vec![2, 4, 6],
///                               vec![2, 4, 7],
///                               vec![2, 5, 6],
///                               vec![2, 5, 7]]);
/// ```
pub fn partial_cartesian<T: Clone>(a: Vec<Vec<T>>, b: Vec<T>) -> Vec<Vec<T>> {
    a.into_iter()
        .flat_map(|xs| {
            b.iter()
                .cloned()
                .map(|y| {
                    let mut vec = xs.clone();
                    vec.push(y);
                    vec
                })
                .collect::<Vec<_>>()
        })
        .collect()
}

/// Computes the Cartesian product of lists[0] * lists[1] * ... * lists[n].
///
/// # Example
///
/// ```
/// let lists: &[&[_]] = &[&[1, 2], &[4, 5], &[6, 7]];
/// let product = cartesian_product(lists);
/// assert_eq!(product, vec![vec![1, 4, 6],
///                          vec![1, 4, 7],
///                          vec![1, 5, 6],
///                          vec![1, 5, 7],
///                          vec![2, 4, 6],
///                          vec![2, 4, 7],
///                          vec![2, 5, 6],
///                          vec![2, 5, 7]]);
/// ```
pub fn cartesian_product<T: Clone>(lists: Vec<Vec<T>>) -> Vec<Vec<T>> {
    match lists.split_first() {
        Some((first, rest)) => {
            let init: Vec<Vec<T>> = first.iter().cloned().map(|n| vec![n]).collect();

            rest.iter()
                .cloned()
                .fold(init, |vec, list| partial_cartesian(vec, list))
        }
        None => vec![],
    }
}
