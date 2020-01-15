use serde::{Deserialize, Serialize};
use serde_json::{Map, Value, json};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

pub mod utils;

//pub mod benches;

use utils::*;
use splines::{Key, Interpolation, Spline};

#[macro_use]
extern crate lazy_static;

// extern crate web_sys;
// use web_sys::console;

// pub struct Timer<'a> {
//     name: &'a str,
// }

// impl<'a> Timer<'a> {
//     pub fn new(name: &'a str) -> Timer<'a> {
//         console::time_with_label(name);
//         Timer { name }
//     }
// }

// impl<'a> Drop for Timer<'a> {
//     fn drop(&mut self) {
//         console::time_end_with_label(self.name);
//     }
// }
// A macro to provide `println!(..)`-style syntax for `console.log` logging.
// macro_rules! log {
//     ( $( $t:tt )* ) => {
//         web_sys::console::log_1(&format!( $( $t )* ).into());
//     }
//  }

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// struct used for storing the Event Data from the type 'start'
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StartValue {
    timestamp: u64,
    select: Option<Vec<String>>,
    group: Option<Vec<String>>,
}

/// struct used for storing the Event Data from the type 'span'
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpanValue {
    timestamp: u64,
    begin: u64,
    end: u64,
}

/// struct used for storing the Event Data from the type 'stop'
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StopValue {
    timestamp: u64,
}

/// struct used for storing the Event Data from the type 'data'
// TODO: It seems that this struct is not generic enough so we will need to refactor the dataset generation
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DataValue {
    timestamp: u64,
    data: Map<String, Value>,
}

/// enum for defining the possible Event types accepted by the process
#[derive(Clone)]
pub enum Event {
    Start(StartValue),
    Span(SpanValue),
    Stop(StopValue),
    Data(DataValue),
    Unknown,
}

/// struct for a Point information from a Event
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct Point {
    value: f64,
    timestamp: u64,
}

/// struct for a DataSet that includes some information about a specific grouping of Events
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct DataSet {
    points: Vec<Point>,
    selection: String,
    group: Vec<(String, Groupable)>,
}

impl DataSet {
    pub fn new(selection: String, group: Vec<(String, Groupable)>, points: Vec<Point>) -> DataSet {
        DataSet {
            points,
            selection,
            group,
        }
    }
    pub fn selection(&self) -> String {
        self.selection.clone()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Groupable {
    Bool(bool),
    String(String),
    Number(f64),
    Null,
}

impl PartialEq for Groupable {
    fn eq(&self, other: &Self) -> bool {
        match self {
            Groupable::Bool(b) => match other {
                Groupable::Bool(b1) => b == b1,
                _ => false,
            },
            Groupable::String(s) => match other {
                Groupable::String(s1) => s1 == s,
                _ => false,
            },
            Groupable::Number(n) => match other {
                Groupable::Number(n1) => n == n1,
                _ => false,
            },
            Groupable::Null => match other {
                Groupable::Null => true,
                _ => false,
            },
        }
    }
}

#[wasm_bindgen]
impl Point {
    pub fn value(&self) -> f64 {
        self.value
    }
    pub fn timestamp(&self) -> u64 {
        self.timestamp
    }

    fn from(
        data_value: &DataValue,
        selection: &String,
        group: &Vec<(String, Groupable)>,
    ) -> Option<Point> {
        let mut point = Point {
            value: 0.0,
            timestamp: data_value.timestamp,
        };
        let is_in_group = {
            let mut is = true;
            for g in group {
                is = is
                    && match data_value.data.get(&g.0) {
                        Some(data) => match data {
                            Value::Bool(d_value) => match g.1 {
                                Groupable::Bool(g_value) => g_value == *d_value,
                                _ => false,
                            },
                            Value::Null => match g.1 {
                                Groupable::Null => true,
                                _ => false,
                            },
                            Value::String(d_s) => match &g.1 {
                                Groupable::String(g_value) => g_value == d_s,
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
                        },
                        _ => false,
                    }
            }
            is
        };
        if is_in_group {
            if let Some(value) = data_value.data.get(selection) {
                if let Value::Number(number) = value {
                    return match number.as_f64() {
                        Some(n) => Some({
                            point.value = n;
                            point
                        }),
                        None => None,
                    };
                }
            }
        }
        None
    }
}

impl From<Map<String,Value>> for Event {
    fn from(map: Map<String, Value>) -> Self {
        if map.is_empty() {
            Event::Unknown
        } else if let Value::String(value) = &map["type"] {
            match value.as_str() {
                "start" => Event::Start(serde_json::from_value(json!(map)).unwrap()),
                "span" => Event::Span(serde_json::from_value(json!(map)).unwrap()),
                "data" => {
                    let timestamp: Option<u64> = match &map["timestamp"] {
                        Value::Number(number) => number.as_u64(),
                        _ => unimplemented!(),
                    };
                    if timestamp.is_some() {
                        Event::Data(DataValue {
                            timestamp: timestamp.unwrap(),
                            data: map,
                        })
                    } else {
                        Event::Unknown
                    }
                }
                "stop" => Event::Stop(serde_json::from_value(json!(map)).unwrap()),
                _ => Event::Unknown,
            }
        } else {
            Event::Unknown
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct EventsData {
    data_events: Vec<DataValue>,
    span: Option<SpanValue>,
    start: Option<StartValue>,
    stop: Option<StopValue>,
    group_map: HashMap<String, Vec<(String, Groupable)>>,
}

impl Default for EventsData {
    fn default() -> EventsData {
        EventsData {
            data_events: Vec::new(),
            span: None,
            start: None,
            stop: None,
            group_map: HashMap::new(),
        }
    }
}

fn datasets_interpolated(datasets: Vec<DataSet>, should_interpolate: bool, interpolate_interval: u64) -> Vec<DataSet> {
    datasets.iter().map(|d| {
        if should_interpolate && d.points.len() > (interpolate_interval as usize) {
            let keys: Vec<Key<f64, f64>> = d.points.iter().map(|p| {
                Key::new(p.timestamp as f64, p.value, Interpolation::default())
            }).collect();
            let spline = Spline::from_vec(keys);
            let first = d.points.first();
            let last = d.points.last();
            if let Some(f_value) = first {
                if let Some(l_value) = last {
                    let mut points: Vec<Point>  = Vec::new();
                    let interval = (l_value.timestamp - f_value.timestamp)/interpolate_interval;
                    for i in 0..interpolate_interval {
                        let key = f_value.timestamp + i*interval;
                        points.push(Point {
                            timestamp: key,
                            value: spline.clamped_sample(key as f64).expect("Failed in clamping")
                        })
                    }
                    return DataSet::new(d.selection.clone(), d.group.clone(), points)
                }
            }
        }
        DataSet::new(d.selection.clone(), d.group.clone(), d.points.to_vec())
    }).collect()
}

#[wasm_bindgen]
impl EventsData {
    pub fn process_text(text: &str) -> JsValue {
       let (events_data, _) = EventsData::from_text(text);
       let datasets: Vec<Vec<DataSet>> = events_data.iter().map(|v| v.dataset_from_events_data()).collect();
       serde_wasm_bindgen::to_value(&datasets).unwrap() 
    }


    pub fn process_js_value(value: JsValue, should_interpolate: bool, interpolate_interval: u64) -> JsValue {
        match value.into_serde::<Value>() {
            Ok(serde_value) => match serde_value {
                Value::Array(values) => {
                    let mut events_data_vec: Vec<EventsData> = Vec::new();
                    for value in values.iter().cloned() {
                        if let Value::Object(map) = value {
                            events_data_vec.push(EventsData::from(map))
                        }
                    }
                    let datasets: Vec<Vec<DataSet>> = events_data_vec.iter().map(|v| datasets_interpolated(v.dataset_from_events_data(), should_interpolate, interpolate_interval)).collect();
                    serde_wasm_bindgen::to_value(&datasets).unwrap()
                },
                Value::Object(value) => {
                    let events_data = vec![EventsData::from(value)];
                    let datasets: Vec<Vec<DataSet>> = events_data.iter().map(|v| {
                        datasets_interpolated(v.dataset_from_events_data(), should_interpolate, interpolate_interval)
                    }).collect();
                    serde_wasm_bindgen::to_value(&datasets).unwrap()
                },
                _ => JsValue::NULL
            },
            Err(_) => JsValue::NULL,
        }
    }
}

impl From<Map<String, Value>> for EventsData {
    fn from(map: Map<String, Value>) -> EventsData {
        let mut new = EventsData {
            data_events: Vec::new(),
            span: serde_json::from_value(map["span"].clone()).unwrap(),
            start: serde_json::from_value(map["start"].clone()).unwrap(),
            stop: serde_json::from_value(map["stop"].clone()).unwrap(),
            group_map: HashMap::new()
        };
        if let Value::Array(values) = map["data_events"].clone() {
            for value in values {
                if let Ok(data) = serde_json::from_value::<DataValue>(value) {
                    new.add_data_value(data);
                }
            }
        }
        new
    }
}

impl EventsData {
    fn from_text(text: &str) -> (Vec<EventsData>, usize) {
        // let _timer = Timer::new("Events::from_text");
        let mut events_vec: Vec<EventsData> = Vec::new();
        let mut events = EventsData::default();
        let mut number_of_lines: usize = 0;
        let mut has_started = false;
        {
            // let _timer1 = Timer::new("Events::from_text#line_loop");
            for line in text.lines() {
                number_of_lines += 1;
                let string_line = fix_non_strict_json(line);
                let v: Value = match serde_json::from_str(string_line.as_ref()) {
                    Ok(result) => result,
                    _ => Value::Null,
                };
                let event = match v {
                    Value::Object(map) => Event::from(map),
                    _ => Event::Unknown,
                };
                match event {
                    Event::Stop(stop_value) => {
                        events.stop = Some(stop_value);
                        events_vec.push(events);
                        events = EventsData::default();
                        number_of_lines = 0;
                        has_started = false;
                    }
                    Event::Start(start_value) => {
                        if has_started {
                            events_vec.push(events);
                            events = EventsData::default();
                            events.start = Some(start_value);
                            number_of_lines = 1;
                        } else {
                            events.start = Some(start_value);
                            has_started = true;
                        }
                    }
                    Event::Span(span_value) => {
                        events.span = Some(span_value);
                    }
                    Event::Data(data_value) => {
                        if has_started {
                            events.add_data_value(data_value);
                        }
                    }
                    Event::Unknown => {}
                };
            }
        }
        if let Some(_) = events.start {
            events_vec.push(events)
        };
        (events_vec, number_of_lines)
    }

    fn add_data_value(&mut self, data_value: DataValue) {
        if let Some(start) = self.start.clone() {
            if let Some(group) = &start.group {
                for g in group {
                    let g_option = match data_value.data.get(g) {
                        Some(data) => match data {
                            Value::Bool(b) => Some(Groupable::Bool(*b)),
                            Value::Null => Some(Groupable::Null),
                            Value::Number(n) => match n.as_f64() {
                                Some(n) => Some(Groupable::Number(n)),
                                None => None,
                            },
                            Value::String(s_) => Some(Groupable::String(s_.clone())),
                            _ => None,
                        },
                        None => None,
                    };
                    if let Some(value) = g_option {
                        self.insert_in_group_map((g.to_string(), value))
                    }
                }
            }
        }
        self.data_events.push(data_value)
    }

    fn insert_in_group_map(&mut self, value: (String, Groupable)) {
        let group_key = &value.0;
        match self.group_map.get_mut(group_key) {
            Some(arr) => {
                if !arr.contains(&value) {
                    arr.push(value.clone())
                }
            }
            None => {
                self.group_map
                    .insert(group_key.clone(), [value.clone()].to_vec());
            }
        }
    }

    fn dataset_from_events_data(&self) -> Vec<DataSet> {
        if let Some(start_value) = &self.start {
            if let Some(select) = &start_value.select {
                if select.len() > 0 {
                    if let Some(_) = self.start.clone() {
                        let group_values: Vec<Vec<(String, Groupable)>> =
                            self.group_map.values().map(|v| v.clone()).collect();
                        let mut data_sets: Vec<DataSet> = {
                            let mut sets: Vec<DataSet> = Vec::new();
                            if group_values.len() > 0 {
                                let groups = cartesian_product(group_values);
                                for s in select {
                                    let mut sets_group: Vec<DataSet> = groups
                                        .iter()
                                        .map(|v| DataSet::new(s.into(), v.to_vec(), Vec::new()))
                                        .collect();
                                    sets.append(&mut sets_group)
                                }
                            } else {
                                for s in select {
                                    sets.push(DataSet::new(s.into(), Vec::new(), Vec::new()));
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
                }
            }
        }
        Vec::new()
    }

    fn get_points_from_datasets(&self, datasets: &Vec<DataSet>) -> Vec<Vec<Point>> {
        let mut points: Vec<Vec<Point>> = datasets.iter().map(|_| Vec::new()).collect();
        let mut stop_timestamp: u64 = 0;
        let mut span_begin_timestamp: u64 = 0;
        let mut span_end_timestamp: u64 = 0;
        let has_span = if let Some(span_value) = &self.span {
            span_begin_timestamp = span_value.begin;
            span_end_timestamp = span_value.end;
            true
        } else {
            false
        };
        let has_stop = if let Some(stop_value) = &self.stop {
            stop_timestamp = stop_value.timestamp;
            true
        } else {
            false
        };
        for data in &self.data_events {
            let mut tuple_idx = 0;
            for d in datasets {
                if let Some(point) = Point::from(data, &d.selection.to_string(), &d.group) {
                    if ((has_stop && stop_timestamp >= point.timestamp) || !has_stop)
                        && ((has_span
                            && point.timestamp >= span_begin_timestamp
                            && point.timestamp <= span_end_timestamp)
                            || !has_span)
                    {
                        points[tuple_idx].push(point);
                    }
                };
                tuple_idx += 1;
            }
        }
        points
    }
}


