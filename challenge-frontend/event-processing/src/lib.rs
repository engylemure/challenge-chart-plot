use serde::{Deserialize, Serialize};
use serde_json::{Map, Result, Value};
use std::collections::HashMap;
use std::fmt;
use wasm_bindgen::prelude::*;

pub mod utils;

use utils::*;

#[macro_use]
extern crate lazy_static;

extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
//macro_rules! log {
//    ( $( $t:tt )* ) => {
//        web_sys::console::log_1(&format!( $( $t )* ).into());
//    }
//}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

/// struct used for storing the Event Data from the type 'start'
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StartValue {
    timestamp: u64,
    select: Vec<String>,
    group: Vec<String>,
}

/// struct used for storing the Event Data from the type 'span'
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SpanValue {
    timestamp: u64,
    begin: u64,
    end: u64,
}

/// struct used for storing the Event Data from the type 'stop'
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StopValue {
    timestamp: u64,
}

/// struct used for storing the Event Data from the type 'data'
// TODO: It seems that this struct is not generic enough so we will need to refactor the dataset generation
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DataValue {
    timestamp: u64,
    data: Map<String, Value>,
}

/// enum for defining the possible Event types accepted by the process
#[derive(Debug, Clone)]
pub enum Event {
    Start(StartValue),
    Span(SpanValue),
    Stop(StopValue),
    Data(DataValue),
    Unknown,
}

/// struct for a Point information from a Event
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct Point {
    value: f64,
    timestamp: u64,
}

/// struct for a DataSet that includes some information about a specific grouping of Events
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct DataSet {
    points: Vec<Point>,
    selection: String,
    group: Vec<(String, Groupable)>,
}

impl DataSet {
    pub fn selection(&self) -> String {
        self.selection.clone()
    }

    pub fn points(&self) -> *const Point {
        self.points.as_ptr()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum Groupable {
    Bool(bool),
    String(String),
    Number(f64),
    Null,
}

#[wasm_bindgen]
impl Point {
    pub fn value(&self) -> f64 {
        self.value
    }
    pub fn timestamp(&self) -> u64 {
        self.timestamp
    }

    fn from(event: Event, selection: String, group: Vec<(String, Groupable)>) -> Option<Point> {
        match event {
            Event::Data(data_value) => {
                let mut point = Point {
                    value: 0.0,
                    timestamp: data_value.timestamp,
                };
                let is_in_group = {
                    let mut is = true;
                    for g in group {
                        is = is
                            && match &data_value.data[&g.0] {
                                Value::Bool(d_value) => match g.1 {
                                    Groupable::Bool(g_value) => g_value == *d_value,
                                    _ => false,
                                },
                                Value::Null => match g.1 {
                                    Groupable::Null => true,
                                    _ => false,
                                },
                                Value::String(d_s) => match g.1 {
                                    Groupable::String(g_value) => g_value == *d_s,
                                    _ => false,
                                },
                                Value::Number(d_n) => match d_n.as_f64() {
                                    Some(n) => match g.1 {
                                        Groupable::Number(g_value) => g_value == n,
                                        _ => false,
                                    },
                                    None => false,
                                },
                                _ => false,
                            }
                    }
                    is
                };
                if is_in_group {
                    match &data_value.data[&selection] {
                        Value::Number(number) => {
                            return match number.as_f64() {
                                Some(n) => Some({
                                    point.value = n;
                                    point
                                }),
                                None => None,
                            }
                        }
                        _ => {}
                    };
                }
                None
            }
            _ => None,
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
                "data" => {
                    let timestamp: Option<u64> = match &map["timestamp"] {
                        Value::Number(number) => number.as_u64(),
                        _ => unimplemented!(),
                    };
                    if timestamp.is_some() {
                        Event::Data(DataValue {
                            timestamp: timestamp.unwrap(),
                            data: map.clone(),
                        })
                    } else {
                        Event::Unknown
                    }
                }
                "stop" => Event::Stop(serde_json::from_value(Value::Object(map))?),
                _ => Event::Unknown,
            },
            _ => Event::Unknown,
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
    select: Vec<String>,
    group_map: HashMap<String, Vec<(String, Groupable)>>,
    number_of_lines: u64,
}

impl Default for EventsData {
    fn default() -> EventsData {
        EventsData {
            events: Vec::new(),
            span_event: Event::Unknown,
            start_event: Event::Unknown,
            stop_event: Event::Unknown,
            select: Vec::new(),
            group_map: HashMap::new(),
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

    pub fn get_events_data_by_idx(&self, idx: usize) -> Option<EventsData> {
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
                _ => Value::Null,
            };
            let event_result = match v {
                Value::Object(map) => Event::from_map(map),
                _ => Ok(Event::Unknown),
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
            Event::Data(data_value) => match &self.start_event {
                Event::Start(start_value) => {
                    for s in &start_value.group {
                        match &data_value.data[s] {
                            Value::Bool(b) => {
                                self.insert_in_group_map((s.clone(), Groupable::Bool(*b)));
                            }
                            Value::Null => {
                                self.insert_in_group_map((s.clone(), Groupable::Null));
                            }
                            Value::Number(n) => match n.as_f64() {
                                Some(n) => {
                                    self.insert_in_group_map((s.clone(), Groupable::Number(n)))
                                }
                                None => (),
                            },
                            Value::String(s_) => {
                                self.insert_in_group_map((
                                    s.clone(),
                                    Groupable::String(s_.clone()),
                                ));
                            }
                            _ => {}
                        }
                    }
                }
                _ => (),
            },
            _ => {}
        };
        self.events.push(event);
    }

    fn insert_in_group_map(&self, value: (String, Groupable)) {}

    pub fn dataset_vec(&self) -> JsValue {
        let dataset = self.dataset_from_events_data();
        serde_wasm_bindgen::to_value(&dataset).unwrap()
    }

    fn dataset_from_events_data(&self) -> Vec<DataSet> {
        if self.select.len() > 0 {
            match self.start_event.clone() {
                Event::Start(start_value) => {
                    let group_values: Vec<Vec<(String, Groupable)>> =
                        self.group_map.values().map(|v| v.clone()).collect();

                    let mut data_sets: Vec<DataSet> = {
                        let mut sets: Vec<DataSet> = Vec::new();
                        if group_values.len() > 0 {
                            let mut groups = cartesian_product(group_values);
                            for s in start_value.select {
                                let mut sets_group: Vec<DataSet> = groups
                                    .iter()
                                    .map(|v| DataSet {
                                        points: Vec::new(),
                                        selection: s.clone(),
                                        group: v.to_vec(),
                                    })
                                    .collect();
                                sets.append(&mut sets_group)
                            }
                        } else {
                            for s in start_value.select {
                                sets.push(DataSet {
                                    points: Vec::new(),
                                    selection: s.clone(),
                                    group: Vec::new(),
                                });
                            }
                        }
                        sets
                    };
                    let mut vec_points = self.get_points_from_datasets(&data_sets);
                    for dataset_idx in 0..data_sets.len() {
                        data_sets[dataset_idx]
                            .points
                            .append(&mut vec_points[dataset_idx])
                    }
                    return data_sets;
                }
                _ => {}
            };
        };
        Vec::new()
    }

    fn get_points_from_datasets(&self, datasets: &Vec<DataSet>) -> Vec<Vec<Point>> {
        let mut points: Vec<Vec<Point>> = datasets.iter().map(|_| Vec::new()).collect();
        let mut stop_timestamp: u64 = 0;
        let mut span_begin_timestamp: u64 = 0;
        let mut span_end_timestamp: u64 = 0;
        let has_span = match self.span_event.clone() {
            Event::Span(span_value) => {
                span_begin_timestamp = span_value.begin;
                span_end_timestamp = span_value.end;
                true
            }
            _ => false,
        };
        let has_stop = match self.stop_event.clone() {
            Event::Stop(stop_value) => {
                stop_timestamp = stop_value.timestamp;
                true
            }
            _ => false,
        };
        for event in self.events.clone() {
            let mut tuple_idx = 0;
            for d in datasets {
                let point = Point::from(event.clone(), d.selection().clone(), d.group.clone());
                match point {
                    Some(point) => {
                        if ((has_stop && stop_timestamp >= point.timestamp) || !has_stop)
                            && ((has_span
                                && point.timestamp >= span_begin_timestamp
                                && point.timestamp <= span_end_timestamp)
                                || !has_span)
                        {
                            points[tuple_idx].push(point);
                        }
                    }
                    None => {}
                };
                tuple_idx += 1;
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
