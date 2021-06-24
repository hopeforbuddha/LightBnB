select properties.*, avg(property_reviews.rating) as average_rating
from properties
join property_reviews on properties.id = property_id
where city like '%tor%'
group by properties.id
having avg(property_reviews.rating) >= 4
order by cost_per_night
limit 5;