module.exports = {$cond: {
    if: {$ifNull: ['$ua.family', false]},
    then: {$cond: {
        if: {$ifNull: ['$ua.major', false]},
        then: {$cond: {
            if: {$ifNull: ['$ua.minor', false]},
            then: {$concat: ['$ua.family', ' ', '$ua.major', '.', '$ua.minor']},
            else: {$concat: ['$ua.family', ' ', '$ua.major']}
        }},
        else: "$ua.family"
    }},
    else: "Unknown"
}};
