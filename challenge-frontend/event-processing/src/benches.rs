extern crate test;
use super::*;

#[cfg(test)]
mod tests {
    use super::*;
    use test::Bencher;
    use super::Events;
    
    #[bench]
    fn event_processing(b: &mut test::Bencher) {
        b.iter(|| {
          let text = "{ \"type\": \"start\", \"timestamp\": 1578045339569, \"select\": [\"min_response_time\", \"max_response_time\"], \"group\": [\"os\", \"browser\"] }
{ \"type\": \"span\", \"timestamp\": 1578045339569, \"begin\": 1578045339569, \"end\": 1578045339574 }
{\"type\": \"data\", \"timestamp\": 1578045339570, \"os\": \"linux\", \"browser\": \"chrome\", \"min_response_time\": 0.1, \"max_response_time\": 1.8}
{\"type\": \"data\", \"timestamp\": 1578045339570, \"os\": \"linux\", \"browser\": \"firefox\", \"min_response_time\": 0.2, \"max_response_time\": 1.8}
{\"type\": \"data\", \"timestamp\": 1578045339570, \"os\": \"windows\", \"browser\": \"chrome\", \"min_response_time\": 0.5, \"max_response_time\": 1.9}
{\"type\": \"data\", \"timestamp\": 1578045339570, \"os\": \"windows\", \"browser\": \"firefox\", \"min_response_time\": 0.4, \"max_response_time\": 1.9}
{\"type\": \"data\", \"timestamp\": 1578045339571, \"os\": \"linux\", \"browser\": \"chrome\", \"min_response_time\": 0.1, \"max_response_time\": 1.5}
{\"type\": \"data\", \"timestamp\": 1578045339571, \"os\": \"linux\", \"browser\": \"firefox\", \"min_response_time\": 0.5, \"max_response_time\": 1.7}
{\"type\": \"data\", \"timestamp\": 1578045339571, \"os\": \"windows\", \"browser\": \"chrome\", \"min_response_time\": 0.5, \"max_response_time\": 1.4}
{\"type\": \"data\", \"timestamp\": 1578045339571, \"os\": \"windows\", \"browser\": \"firefox\", \"min_response_time\": 0.6, \"max_response_time\": 1.6}
{\"type\": \"data\", \"timestamp\": 1578045339572, \"os\": \"linux\", \"browser\": \"chrome\", \"min_response_time\": 0.1, \"max_response_time\": 1.9}
{\"type\": \"data\", \"timestamp\": 1578045339572, \"os\": \"linux\", \"browser\": \"firefox\", \"min_response_time\": 0.9, \"max_response_time\": 1.6}
{\"type\": \"data\", \"timestamp\": 1578045339572, \"os\": \"windows\", \"browser\": \"chrome\", \"min_response_time\": 0.5, \"max_response_time\": 1.4}
{\"type\": \"data\", \"timestamp\": 1578045339572, \"os\": \"windows\", \"browser\": \"firefox\", \"min_response_time\": 0.6, \"max_response_time\": 1}
{\"type\": \"data\", \"timestamp\": 1578045339573, \"os\": \"linux\", \"browser\": \"chrome\", \"min_response_time\": 0.5, \"max_response_time\": 1.4}
{\"type\": \"data\", \"timestamp\": 1578045339573, \"os\": \"linux\", \"browser\": \"firefox\", \"min_response_time\": 0.9, \"max_response_time\": 1.9}
{\"type\": \"data\", \"timestamp\": 1578045339573, \"os\": \"windows\", \"browser\": \"chrome\", \"min_response_time\": 0.4, \"max_response_time\": 1.8}
{\"type\": \"data\", \"timestamp\": 1578045339573, \"os\": \"windows\", \"browser\": \"firefox\", \"min_response_time\": 0.9, \"max_response_time\": 1.9}
{\"type\": \"data\", \"timestamp\": 1578045339574, \"os\": \"linux\", \"browser\": \"chrome\", \"min_response_time\": 0.8, \"max_response_time\": 1.4}
{\"type\": \"data\", \"timestamp\": 1578045339574, \"os\": \"linux\", \"browser\": \"firefox\", \"min_response_time\": 0.1, \"max_response_time\": 1.6}
{\"type\": \"data\", \"timestamp\": 1578045339574, \"os\": \"windows\", \"browser\": \"chrome\", \"min_response_time\": 1, \"max_response_time\": 1.9}
{\"type\": \"data\", \"timestamp\": 1578045339574, \"os\": \"windows\", \"browser\": \"firefox\", \"min_response_time\": 0.2, \"max_response_time\": 1.8}
{\"type\": \"stop\", \"timestamp\": 1578045339579 }
        ";
        let events = Events::from_text(text);
        let events_data = events.process_events_data();
        })
    }
}