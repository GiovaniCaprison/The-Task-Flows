#!/bin/bash

TAG_KEY="IsengardFarmMasterAccountResources"
TAG_VALUE="True"

add_tag() {
    RESOURCE_ARN=$1
    aws resourcegroupstaggingapi tag-resources \
        --resource-arn-list "$RESOURCE_ARN" \
        --tags "$TAG_KEY=$TAG_VALUE"
    if [ $? -eq 0 ]; then
        echo "Successfully tagged $RESOURCE_ARN"
    else
        echo "Failed to tag $RESOURCE_ARN"
    fi
}

USERS=$(aws iam list-users --query 'Users[*].Arn' --output text)
for USER_ARN in $USERS; do
    add_tag "$USER_ARN"
done

ROLES=$(aws iam list-roles --query 'Roles[*].Arn' --output text)
for ROLE_ARN in $ROLES; do
    add_tag "$ROLE_ARN"
done

GROUPS=$(aws iam list-groups --query 'Groups[*].Arn' --output text)
for GROUP_ARN in $GROUPS; do
    add_tag "$GROUP_ARN"
done

POLICIES=$(aws iam list-policies --scope Local --query 'Policies[*].Arn' --output text)
for POLICY_ARN in $POLICIES; do
    add_tag "$POLICY_ARN"
done

INSTANCE_PROFILES=$(aws iam list-instance-profiles --query 'InstanceProfiles[*].InstanceProfileName' --output text)
for INSTANCE_PROFILE in $INSTANCE_PROFILES; do
    ROLES=$(aws iam get-instance-profile --instance-profile-name "$INSTANCE_PROFILE" --query 'InstanceProfile.Roles[*].Arn' --output text)
    for ROLE_ARN in $ROLES; do
        add_tag "$ROLE_ARN"
    done
done

echo "Tagging completed."