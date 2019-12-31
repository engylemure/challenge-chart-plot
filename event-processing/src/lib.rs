use serde_json::{Result, Value, Map};
use std::io::Result as StdResult;
use serde::{Deserialize, Serialize};
use std::fmt;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;
pub mod utils;

use utils::*;

#[macro_use]
extern crate lazy_static;


extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, event-processing!");
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StartValue {
    timestamp: u64,
    select: Vec<String>,
    group: Vec<String>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SpanValue {
    timestamp: u64,
    begin: u64,
    end: u64,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StopValue {
    timestamp: u64,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DataValue {
    timestamp: u64,
    os: String,
    browser: String,
    min_response_time: f32,
    max_response_time: f32,
}

#[derive(Debug, Clone)]
pub enum Event {
    Start(StartValue),
    Span(SpanValue),
    Stop(StopValue),
    Data(DataValue),
    Unknown,
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct Point {
    value: f32,
    timestamp: u64,
}

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct DataSet {
    points: Vec<Point>,
    selection: String,
    group: (Option<String>, Option<String>),
}


impl DataSet {
    pub fn selection(&self) -> String {
        self.selection.clone()
    }

    pub fn points(&self) -> *const Point {
        self.points.as_ptr()
    }
}

#[wasm_bindgen]
impl Point {
    pub fn value(&self) -> f32 {
        self.value
    }
    pub fn timestamp(&self) -> u64 {
        self.timestamp
    }

    fn from(event: Event, selection: String, os: Option<String>, browser: Option<String>) -> Option<Point> {
        match event {
            Event::Data(data_value) => {
                let mut point = Point {
                    value: 0.0,
                    timestamp: data_value.timestamp,
                };
                if selection == String::from("min_response_time") {
                    point.value = data_value.min_response_time;
                } else if selection == String::from("max_response_time") {
                    point.value = data_value.max_response_time;
                } else {
                    return None;
                }
                let is_in_os = match os {
                    Some(os) => data_value.os == os,
                    None => true
                };
                let is_in_browser = match browser {
                    Some(browser) => data_value.browser == browser,
                    None => true
                };
                if is_in_browser && is_in_os {
                    Some(point)
                } else {
                    None
                }
            }
            _ => None
        }
    }
}

impl Event {
    pub fn from_map(map: Map<String, Value>) -> Result<Event> {
        if map.is_empty() {
            return Ok(Event::Unknown);
        }
        Ok(match &map["type"] {
            Value::String(value) => match value.as_str() {
                "start" => Event::Start(serde_json::from_value(Value::Object(map))?),
                "span" => Event::Span(serde_json::from_value(Value::Object(map))?),
                "data" => Event::Data(serde_json::from_value(Value::Object(map))?),
                "stop" => Event::Stop(serde_json::from_value(Value::Object(map))?),
                _ => Event::Unknown
            },
            _ => Event::Unknown
        })
    }
}


#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct EventsData {
    events: Vec<Event>,
    span_event: Event,
    start_event: Event,
    stop_event: Event,
    os_map: HashMap<String, bool>,
    browser_map: HashMap<String, bool>,
    number_of_lines: u64,
}

impl Default for EventsData {
    fn default() -> EventsData {
        EventsData {
            events: Vec::new(),
            span_event: Event::Unknown,
            start_event: Event::Unknown,
            stop_event: Event::Unknown,
            os_map: HashMap::new(),
            browser_map: HashMap::new(),
            number_of_lines: 0,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Events {
    events: Vec<EventsData>,
    number_of_lines: usize,
}

#[wasm_bindgen]
impl Events {
    pub fn from_text(text: String) -> Events {
        let data_from_text = EventsData::from_text(text);
        Events {
            events: data_from_text.0,
            number_of_lines: data_from_text.1,
        }
    }

    pub fn events_count(&self) -> usize {
        self.events.len()
    }

    pub fn get_events_data_by_idx(&self, idx: usize) -> Option<EventsData>{
        Some(self.events[idx].clone())
    }

    pub fn events(&self) -> *const EventsData {
        self.events.as_ptr()
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

impl fmt::Display for Events {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}\n", self)?;
        Ok(())
    }
}

#[wasm_bindgen]
impl EventsData {
    fn from_text(text: String) -> (Vec<EventsData>, usize) {
        let mut events_vec: Vec<EventsData> = Vec::new();
        let mut events = EventsData::default();
        let mut number_of_lines: u64 = 0;
        let mut has_started = false;
        let cloned_text = text.clone();
        let lines = cloned_text.lines();
        let line_count = lines.count();
        let mut line_idx = 0;
        for line in text.lines() {
            number_of_lines += 1;
            line_idx += 1;
            let string_line = line_transformation(line);
            let v: Value = match serde_json::from_str(string_line.as_str()) {
                Ok(result) => result,
                _ => Value::Null
            };
            let event_result = match v {
                Value::Object(map) => Event::from_map(map),
                _ => Ok(Event::Unknown)
            };
            match event_result {
                Ok(event) => {
                    match event {
                        Event::Stop(stop_value) => {
                            events.stop_event = Event::Stop(stop_value);
                            events.number_of_lines = number_of_lines;
                            events_vec.push(events);
                            events = EventsData::default();
                            number_of_lines = 0;
                            has_started = false;
                        }
                        Event::Start(start_value) => {
                            if has_started {
                                events.number_of_lines = number_of_lines - 1;
                                events_vec.push(events);
                                events = EventsData::default();
                                events.start_event = Event::Start(start_value);
                                number_of_lines = 1;
                            } else {
                                events.start_event = Event::Start(start_value);
                                has_started = true;
                            }
                        }
                        Event::Span(span_value) => {
                            events.span_event = Event::Span(span_value);
                        }
                        Event::Data(data_value) => {
                            if has_started {
                                events.add_event(Event::Data(data_value));
                            }
                        }
                        Event::Unknown => {}
                    };
                }
                Err(_) => {}
            };
            if line_idx == line_count {
                events.number_of_lines = number_of_lines;
                match events.start_event {
                    Event::Start(_) => events_vec.push(events),
                    _ => {}
                }
                events = EventsData::default();
                number_of_lines = 0;
            }
        }
        (events_vec, line_count)
    }

    fn add_event(&mut self, event: Event) {
        match &event {
            Event::Data(data_value) => {
                self.browser_map.insert(data_value.browser.clone(), true);
                self.os_map.insert(data_value.os.clone(), true);
            }
            _ => {}
        };
        self.events.push(event);
    }

    pub fn dataset_vec(&self) -> JsValue {
        let dataset = self.dataset_from_events_data();
        serde_wasm_bindgen::to_value(&dataset).unwrap()
    }

    fn dataset_from_events_data(&self) -> Vec<DataSet> {
        match self.start_event.clone() {
            Event::Start(start_value) => {
                let mut groups: Vec<(String, Option<String>, Option<String>)> = Vec::new();
                if start_value.group.len() == 0 {
                    for selection in start_value.select {
                        groups.push((selection, None, None));
                    }
                } else {
                    let group_has_os = start_value.group.contains(&String::from("os"));
                    let group_has_browser = start_value.group.contains(&String::from("browser"));
                    if group_has_browser && group_has_os {
                        for os in self.os_map.keys() {
                            for browser in self.browser_map.keys() {
                                for selection in start_value.select.clone() {
                                    groups.push((selection, Some(os.clone()), Some(browser.clone())));
                                }
                            }
                        }
                    } else if group_has_browser {
                        for browser in self.browser_map.keys() {
                            for selection in start_value.select.clone() {
                                groups.push((selection, None, Some(browser.clone())));
                            }
                        }
                    } else if group_has_os {
                        for os in self.os_map.keys() {
                            for selection in start_value.select.clone() {
                                groups.push((selection, Some(os.clone()), None));
                            }
                        }
                    } else {
                        for selection in start_value.select {
                            groups.push((selection, None, None));
                        }
                    }
                }
                let data_sets: Vec<DataSet> = groups.iter().map(|v: &(String, Option<String>, Option<String>)| {
                    DataSet {
                        points: self.get_points_by_tuple_info(v.clone().into()),
                        selection: v.0.clone(),
                        group: (v.1.clone(), v.2.clone())
                    }
                }).collect();
                return data_sets;
            },
            _ => {}
        };
        Vec::new()
    }

    fn get_points_by_tuple_info(&self, tuple: (String, Option<String>, Option<String>)) -> Vec<Point> {
        let mut points: Vec<Point> = Vec::new();
        let mut stop_timestamp: u64 = 0;
        let mut span_begin_timestamp: u64 = 0;
        let mut span_end_timestamp: u64 = 0;
        let has_span = match self.span_event.clone() {
            Event::Span(span_value) => {
                span_begin_timestamp = span_value.begin;
                span_end_timestamp = span_value.end;
                true
            }
            _ => false
        };
        let has_stop = match self.stop_event.clone() {
            Event::Stop(stop_value) => {
                stop_timestamp = stop_value.timestamp;
                true
            }
            _ => false
        };
        for event in self.events.clone() {
            let point = Point::from(event, tuple.0.clone(), tuple.1.clone(), tuple.2.clone());
            match point {
                Some(point) => {
                    if ((has_stop && stop_timestamp >= point.timestamp) || !has_stop) && ((has_span && point.timestamp >= span_begin_timestamp && point.timestamp <= span_end_timestamp) || !has_span) {
                        points.push(point);
                    }
                }
                None => {}
            }
        }
        points
    }

    pub fn number_of_lines(&self) -> u64 {
        self.number_of_lines
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

impl fmt::Display for EventsData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}\n", self)?;
        Ok(())
    }
}
